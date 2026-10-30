import json, sys
d = json.load(open(sys.argv[1], encoding="utf-8"))
for k, v in list(d["whole"].items()):
    if "\n" in k: d["whole"][k] = r"\begin{gathered}" + v + r"\end{gathered}"
d["whole"] = {k: v for k, v in d["whole"].items() if not k.replace("/", "").isdigit()}
open(sys.argv[2], "w", encoding="utf-8").write("/* Dibuat otomatis dari lapis0.js, lapis1.js, dan dalam.js: teks rumus Unicode -> LaTeX untuk KaTeX. */\nwindow.RUMUS = " + json.dumps(d, ensure_ascii=False) + ";\n")
print({k: len(v) for k, v in d.items()})
