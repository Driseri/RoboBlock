from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import asyncio, os, tempfile, pathlib, shutil, subprocess
import datetime

FQBN_DEFAULT = "arduino:avr:uno"
TIMEOUT = 60          # сек
app = FastAPI(
    title="Arduino Compiler API",
    description="API для загрузки Arduino-скетча (.ino), компиляции его с помощью arduino-cli и получения скомпилированного .hex файла.",
    version="1.0.0"
)

@app.post("/compile/", response_class=FileResponse, summary="Компиляция Arduino-скетча", response_description="HEX-файл прошивки")
async def compile_arduino_code(
    file: UploadFile = File(..., description="Файл Arduino-скетча (.ino) для компиляции."),
    fqbn: str = FQBN_DEFAULT
):
    """
    Загружает Arduino-скетч (.ino), компилирует его с помощью arduino-cli и возвращает скомпилированный .hex файл.

    - **file**: Arduino-скетч (.ino)
    - **fqbn**: Fully Qualified Board Name (по умолчанию arduino:avr:uno)

    **Ответ:**
    - Успех: HEX-файл прошивки (application/octet-stream)
    - Ошибка: HTTP 400/500 с текстом ошибки
    """
    if not file.filename.endswith(".ino"):
        raise HTTPException(400, "Need .ino")

    precomp_dir = pathlib.Path(__file__).parent.parent / "preComp"
    precomp_dir.mkdir(exist_ok=True)

    # Сохраняем .ino в preComp с уникальным именем
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
    sketch_name = pathlib.Path(file.filename).stem
    precomp_ino = precomp_dir / f"{sketch_name}_{timestamp}.ino"
    precomp_ino.write_bytes(await file.read())

    # Создаём временную папку-скетч для компиляции
    with tempfile.TemporaryDirectory() as td:
        sketch_dir = pathlib.Path(td) / sketch_name
        sketch_dir.mkdir()
        sketch_file = sketch_dir / f"{sketch_name}.ino"
        shutil.copy2(precomp_ino, sketch_file)

        # Компиляция
        proc = await asyncio.create_subprocess_exec(
            "arduino-cli", "compile",
            "--fqbn", fqbn,
            "--output-dir", str(sketch_dir),
            str(sketch_dir),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
        )
        try:
            stdout, _ = await asyncio.wait_for(proc.communicate(), TIMEOUT)
        except asyncio.TimeoutError:
            proc.kill()
            raise HTTPException(504, "Compile timeout")

        if proc.returncode:
            raise HTTPException(400, f"Compile error (code {proc.returncode}):\n{stdout.decode()}")

        # Явно формируем путь к hex-файлу
        hex_path = sketch_dir / f"{sketch_name}.ino.hex"
        if not hex_path.exists():
            files = list(sketch_dir.rglob("*"))
            file_list = "\n".join(str(f.relative_to(sketch_dir)) for f in files)
            raise HTTPException(
                500,
                f"HEX not found at {hex_path}.\n\nFiles in sketch dir:\n{file_list}\n\nCompiler output:\n{stdout.decode()}"
            )

        # Копируем .hex в postComp
        postcomp_dir = pathlib.Path(__file__).parent.parent / "postComp"
        postcomp_dir.mkdir(exist_ok=True)
        postcomp_hex = postcomp_dir / f"{sketch_name}_{timestamp}.ino.hex"
        shutil.copy2(hex_path, postcomp_hex)

        return FileResponse(postcomp_hex, media_type="text/plain", filename="firmware.hex")
