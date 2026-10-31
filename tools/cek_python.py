"""Jalankan setiap blok <pre><code> di file pelajaran dan cocokkan keluarannya dengan komentar.
Keluaran yang diharapkan: komentar di ujung baris print(...), atau baris yang hanya berisi komentar.
Pakai: python tools/cek_python.py lapis2.js [lapis3.js ...]"""
import re, html, io, contextlib, sys
sys.stdout.reconfigure(encoding="utf-8")
bad = 0
for f in sys.argv[1:]:
    s = open(f, encoding="utf-8").read()
    for m in re.finditer(r'window\.LESSONS\["([\d.]+)"\]|<pre><code>(.*?)</code></pre>', s, re.S):
        if m.group(1): lid = m.group(1); n = 0; continue
        n += 1
        code = html.unescape(re.sub(r"<[^>]+>", "", m.group(2)))
        if code.lstrip().startswith(">>>"):  # gaya REPL: dicek dengan doctest
            import doctest
            t = doctest.DocTestParser().get_doctest(code, {}, f"{lid}#{n}", f, 0)
            r = doctest.DocTestRunner(optionflags=doctest.NORMALIZE_WHITESPACE)
            out = io.StringIO(); r.run(t, out=out.write)
            if r.failures: bad += 1; print(f"BEDA {f} {lid}#{n} (REPL)\n" + out.getvalue())
            else: print(f"ok {lid}#{n} (REPL, {r.tries} perintah)")
            continue
        want = []
        for line in code.split("\n"):
            st = line.strip()
            if st.startswith("#"): want.append(st[1:].strip())
            elif "print(" in line and "#" in line: want.append(line.split("#", 1)[1].strip())
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf): exec(code, {"__name__": "__main__"})
        except Exception as e:
            bad += 1; print(f"ERROR {f} {lid}#{n}: {e!r}"); continue
        got = [l.strip() for l in buf.getvalue().strip().split("\n") if l.strip()]
        norm = lambda t: " ".join(t.split())
        if [norm(x) for x in got] != [norm(x) for x in want]:
            bad += 1; print(f"BEDA {f} {lid}#{n}")
            for a, b in zip(want + [""] * 9, got + [""] * 9):
                if a or b: print(f"   tulis: {a!r:50} keluar: {b!r}")
        else: print(f"ok {lid}#{n} ({len(got)} baris)")
print("bermasalah:", bad); sys.exit(1 if bad else 0)
