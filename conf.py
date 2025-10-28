# -*- coding: utf-8 -*-
import os
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("../src"))
project = "lernjs"
copyright = f"{datetime.now().year}, nxf-oss"
author = "nxf-oss"
version = "1.0"
release = "1.0.0"
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.autosummary",
    "sphinx.ext.viewcode",
    "sphinx.ext.napoleon",
    "sphinx.ext.intersphinx",
    "sphinx.ext.todo",
    "sphinx.ext.mathjax",
    "sphinx.ext.ifconfig",
    "sphinx.ext.githubpages",
    "myst_parser",
    "sphinx_copybutton",
    "sphinx_design",
    "sphinxext.opengraph",
    "sphinxcontrib.mermaid",
    "sphinx_git",
]
myst_enable_extensions = [
    "colon_fence",
    "deflist",
    "fieldlist",
    "html_admonition",
    "html_image",
    "linkify",
    "replacements",
    "smartquotes",
    "strikethrough",
    "substitution",
    "tasklist",
    "dollarmath",
    "amsmath",
]
myst_heading_anchors = 3
myst_footnote_transition = True
language = "id"
locale_dirs = ["locales/"]
gettext_compact = False
source_suffix = {
    ".rst": "restructuredtext",
    ".md": "markdown",
}
master_doc = "index"
exclude_patterns = [
    "_build",
    "Thumbs.db",
    ".DS_Store",
    "README.md",
    "venv",
    ".github",
]
include_patterns = ["**"]
html_theme = "sphinx_book_theme"
html_theme_options = {
    "repository_url": "https://github.com/username/repo",
    "repository_branch": "main",
    "path_to_docs": ".",
    "use_repository_button": True,
    "use_issues_button": True,
    "use_edit_page_button": True,
    "home_page_in_toc": True,
    "show_navbar_depth": 4,
    "show_toc_level": 4,
    "use_download_button": False,
    "collapse_navbar": True,
}
html_title = f"{project} v{version}"
html_short_title = f"{project}"
html_logo = "_static/_logo.png"
html_favicon = "_static/_favicon.ico"
html_static_path = ["_static"]
html_js_files = [
    "index.js",
]
html_sidebars = {
    "**": [
        "globaltoc.html",
        "relations.html",
        "sourcelink.html",
        "searchbox.html",
    ]
}
autodoc_default_options = {
    "members": True,
    "member-order": "groupwise",
    "special-members": "__init__",
    "undoc-members": True,
    "exclude-members": "__weakref__",
}
autodoc_typehints = "description"
autoclass_content = "both"
autosummary_generate = True
autosummary_generate_overwrite = True
napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = True
napoleon_include_special_with_doc = True
napoleon_use_admonition_for_examples = True
napoleon_use_admonition_for_notes = True
napoleon_use_admonition_for_references = True
napoleon_use_ivar = True
napoleon_use_param = True
napoleon_use_rtype = True
napoleon_use_keyword = True
intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "sphinx": ("https://www.sphinx-doc.org/en/master", None),
    "numpy": ("https://numpy.org/doc/stable/", None),
    "scipy": ("https://docs.scipy.org/doc/scipy/", None),
    "pandas": ("https://pandas.pydata.org/docs/", None),
}
todo_include_todos = True
todo_link_only = True
github_username = "username_anda"
github_repository = "nama-repository"
github_branch = "main"
copybutton_prompt_text = r">>> |\.\.\. |\$ |In \[\d*\]: | {2,5}\.\.\.: | {5,8}: "
copybutton_prompt_is_regexp = True
ogp_site_url = "https://username.github.io/repository/"
ogp_image = "_static/og-image.png"
ogp_description_length = 200
ogp_type = "website"
gettext_allow_fuzzy_translations = True
figure_language_filename = "{path}{language}/{basename}{ext}"
primary_domain = "py"
default_role = "any"
rst_prolog = """
.. |project| replace:: {project}
.. |version| replace:: {version}
""".format(
    project=project, version=version
)
math_numfig = True
math_eqref_format = "Eq. {number}"
linkcheck_ignore = [
    r"http://localhost:\d+/",
    r"https://example.com/",
]
linkcheck_retries = 3
linkcheck_timeout = 30
smartquotes = True
trim_footnote_reference_space = True
suppress_warnings = [
    "image.nonlocal_uri",
]
numfig = True
numfig_format = {
    "figure": "Gambar %s",
    "table": "Tabel %s",
    "code-block": "Listing %s",
    "section": "Bagian %s",
}


def setup(app):
    app.add_js_file("index.js")
