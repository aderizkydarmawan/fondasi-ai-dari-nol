"""Ubah rumus Unicode di pelajaran menjadi LaTeX (untuk KaTeX). Mencetak pasangan untuk diperiksa, menulis web/rumus.js."""
import re, json, sys, html
sys.stdout.reconfigure(encoding="utf-8")
WEB = sys.argv[1]
SUB = dict(zip("₀₁₂₃₄₅₆₇₈₉₊₋₌ᵢⱼₖₙₘₜ", "0123456789+-=ijknmt"))
SUP = dict(zip("⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐᵏˣᶻⁱʲ", "0123456789+-nmkxzij"))
SPECIAL = set(SUB) | set(SUP) | set("Σ√‖θσΔ̄ŷℝ")
FUNCS = {"log", "ln", "cos", "sin", "exp"}
TEXTWORDS = {"Var", "varians", "selisih", "sisi", "miring", "bobot", "input", "bias", "hasil", "jarak", "peluang", "rata", "Simpangan", "baku", "Varians", "dari"}

def conv(s):
    s = html.unescape(s)
    out, i = [], 0
    def run(table, j):
        k = j
        while k < len(s) and s[k] in table: k += 1
        return "".join(table[c] for c in s[j:k]), k
    while i < len(s):
        c = s[i]
        if c in SUB:
            t, i = run(SUB, i); out.append("_{" + t + "}"); continue
        if s.startswith("ᵐˣⁿ", i): out.append("^{m\\times n}"); i += 3; continue
        if c in SUP:
            t, i = run(SUP, i); out.append("^{" + t + "}"); continue
        if c == "Σ":
            m = re.match(r"Σ([ᵢⱼₖ])₌([₀-₉]+)([⁰-⁹ⁿᵐ]+)", s[i:])
            if m:
                out.append("\\sum_{" + SUB[m.group(1)] + "=" + "".join(SUB[x] for x in m.group(2)) + "}^{" + "".join(SUP[x] for x in m.group(3)) + "} "); i += len(m.group()); continue
            out.append("\\sum "); i += 1; continue
        if c == "√":
            i += 1
            if i < len(s) and s[i] == "(":
                d, j = 0, i
                while j < len(s):
                    if s[j] == "(": d += 1
                    elif s[j] == ")":
                        d -= 1
                        if d == 0: break
                    j += 1
                if j < len(s):
                    out.append("\\sqrt{" + conv(s[i+1:j]) + "}"); i = j + 1; continue
                out.append("\\surd"); continue
            m = re.match(r"[A-Za-z0-9]+(?:,[0-9]+)?", s[i:])
            if m:
                w = m.group(); out.append("\\sqrt{" + (("\\text{" + w + "}") if len(w) > 1 and w.isalpha() else w) + "}"); i += len(w); continue
            out.append("\\surd"); continue
        if s.startswith("x̄", i) or (c.isalpha() and s[i+1:i+2] == "̄"):
            out.append("\\bar{" + c + "}"); i += 2; continue
        if c == "^" and s[i+1:i+2] == "(":
            d, j = 0, i+1
            while j < len(s):
                if s[j] == "(": d += 1
                elif s[j] == ")":
                    d -= 1
                    if d == 0: break
                j += 1
            out.append("^{" + conv(s[i+2:j]) + "}"); i = j + 1; continue
        if c == "ŷ": out.append("\\hat{y}"); i += 1; continue
        if c == "‖": out.append("\\|"); i += 1; continue
        m = re.match(r"[A-Za-z]{2,}", s[i:])
        if m:
            w = m.group()
            if w in FUNCS: out.append("\\" + w + " ")
            elif w == "Var": out.append("\\operatorname{Var}")
            elif w in VARWORDS: out.append(w)
            else: out.append("\\text{" + w + "}")
            i += len(w); continue
        rep = {"×": "\\times ", "÷": "\\div ", "·": "\\cdot ", "−": "-", "θ": "\\theta ", "σ": "\\sigma ", "Δ": "\\Delta ", "≈": "\\approx ", "≠": "\\neq ", "≤": "\\le ", "≥": "\\ge ", "ℝ": "\\mathbb{R}", "…": "\\dots ", "{": "\\{", "}": "\\}", "%": "\\%", "_": "\\_"}
        if c in rep: out.append(rep[c]); i += 1; continue
        if s.startswith("...", i): out.append("\\dots "); i += 3; continue
        if c == "-" and i > 0 and s[i-1].isalpha() and s[i+1:i+2].isalpha():
            out.append("\\text{-}"); i += 1; continue
        out.append(c); i += 1
    r = re.sub(r"\s+", " ", "".join(out)).strip()
    # kata-kata berurutan jadi satu \text agar spasinya tetap ada; spasi di sekitar kata dibuat eksplisit
    r = r.replace("}\\text{-}\\text{", "-")
    while True:
        r2 = re.sub(r"\\text\{([^}]*)\} \\text\{", r"\\text{\1 ", r)
        if r2 == r: break
        r = r2
    r = re.sub(r"(\\text\{[^}]*\}) (?=[A-Za-z0-9(\\])", r"\1\\ ", r)
    r = re.sub(r"(?<=[A-Za-z0-9)}]) (\\text\{)", r"\\ \1", r)
    return re.sub(r"(?<=\d),(?=\d)", "{,}", r)

VARWORDS = {"ab","ac","wx","mx","th","au","bw","aX","uv","xy","mn","ay"}
def mathy(w):
    core = w.strip(".,;:()?!“”")
    if not core: return False
    if w.endswith(":") and not any(c in SPECIAL or c in "()" for c in core): return False
    if re.fullmatch(r"[A-Za-z]+(-[A-Za-z]+)+", core): return False
    if re.fullmatch(r"[A-Za-z]+", core) and len(core) >= 2 and core not in FUNCS and core not in VARWORDS and core != "Var": return False
    if any(c in SPECIAL for c in core): return True
    if core.isalpha():
        return len(core) == 1 or core in FUNCS or core in VARWORDS or core == "Var"
    return True  # mengandung angka, operator, atau simbol khusus
def spans(text):
    toks = text.split(" ")
    i = 0
    while i < len(toks):
        if not mathy(toks[i]): i += 1; continue
        j = i
        while j < len(toks) and mathy(toks[j]):
            j += 1
            if toks[j-1].endswith(":"): break
        run = [t for t in toks[i:j]]
        t = " ".join(run).strip()
        t = t.rstrip(".,;:").strip()
        while t.endswith(")") and t.count("(") < t.count(")"): t = t[:-1].rstrip()
        while t.startswith("(") and t.count("(") > t.count(")"): t = t[1:].lstrip()
        while t.startswith(("+ ", "= ", ") ")): t = t[2:]
        if any(c in SPECIAL for c in t) and len(t) > 0: yield t
        i = j

found = {}
whole, code = {}, {}
CODE_MATH = ["2x + 5", "3(x + 4)", "3x + 2y", "3x + 5 = 20", "4x + 2x − x", "5x", "f(x) = 2x + 1", "y = mx + b", "y = w·x + b"]
for k in CODE_MATH: code[k] = conv(k)
for f in ["lapis0.js", "lapis1.js", "dalam.js"]:
    s = open(f"{WEB}/{f}", encoding="utf-8").read()
    s = re.sub(r"<pre>.*?</pre>", "", s, flags=re.S)
    s = re.sub(r"<code>.*?</code>", "", s, flags=re.S)
    # rumus utuh: <mark> dan .big, diubah seluruhnya
    for m in re.finditer(r'<mark>(.*?)</mark>|<div class="big">(.*?)</div>', s, flags=re.S):
        inner = m.group(1) if m.group(1) is not None else m.group(2)
        txt = html.unescape(re.sub(r"<[^>]+>", "", inner.replace("<br>", "\n")))
        if not re.search(r"[0-9=+×÷·−Σ√²³ⁿ]", txt): continue  # kalimat, bukan rumus
        whole[txt] = " \\\\ ".join(conv(line) for line in txt.split("\n"))
    s = re.sub(r"<mark>.*?</mark>|<div class=\"big\">.*?</div>", " ", s, flags=re.S)
    for chunk in re.split(r"<[^>]+>|\\n|\n|\"|`|&nbsp;| ", s):
        for t in spans(html.unescape(chunk)): found[t] = conv(t)
for name, d in (("UTUH", whole), ("KODE", code), ("TEKS", found)):
    print("=====", name, len(d))
    for k, v in sorted(d.items(), key=lambda kv: -len(kv[0])): print(k.replace("\n", " / "), "  =>  ", v)
json.dump({"whole": whole, "code": code, "inline": found}, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=0)
