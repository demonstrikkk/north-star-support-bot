from __future__ import annotations

import logging
import os
import signal
import sys
from logging.handlers import RotatingFileHandler

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


def configure_logging() -> None:
    log_level = os.getenv("LOG_LEVEL", "info").upper()
    fmt = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"

    logging.basicConfig(level=getattr(logging, log_level, logging.INFO), format=fmt, stream=sys.stdout)

    log_dir = os.getenv("LOG_DIR", "")
    if log_dir:
        os.makedirs(log_dir, exist_ok=True)
        file_handler = RotatingFileHandler(
            os.path.join(log_dir, "north-star-support-bot.log"),
            maxBytes=10_485_760,
            backupCount=3,
        )
        file_handler.setFormatter(logging.Formatter(fmt))
        logging.getLogger().addHandler(file_handler)


def main() -> None:
    configure_logging()
    logger = logging.getLogger("run")
    logger.info("Starting North Star Support Bot")

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    log_level = os.getenv("LOG_LEVEL", "info").lower()

    import uvicorn

    config = uvicorn.Config(
        "app.main:app",
        host=host,
        port=port,
        log_level=log_level,
        reload=False,
        workers=int(os.getenv("UVICORN_WORKERS", "1")),
    )
    server = uvicorn.Server(config=config)

    def shutdown(*args: object) -> None:
        logger.info("Shutdown signal received — stopping server")
        server.should_exit = True

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    server.run()


if __name__ == "__main__":
    main()
