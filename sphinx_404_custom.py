import os
from sphinx.util import logging

logger = logging.getLogger(__name__)


def copy_404(app, exception):
    """Copy custom 404.html ke folder build html."""
    if exception:
        return
    src = os.path.join(app.srcdir, "_static", "_html", "404.html")
    dst = os.path.join(app.outdir, "404.html")
    if os.path.exists(src):
        import shutil

        shutil.copyfile(src, dst)
        logger.info("Custom 404.html copied to build folder.")
    else:
        logger.warning("Custom 404.html not found in _static/_html/")


def setup(app):
    # dipanggil saat build selesai
    app.connect("build-finished", copy_404)
    return {"version": "1.0", "parallel_read_safe": True}
