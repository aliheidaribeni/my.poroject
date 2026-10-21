const fs = require("fs");
const html = fs.readFileSync("vpn-link-to-json.html", "utf8");
const core = /<script id="core">([\s\S]*?)<\/script>/.exec(html)[1];
const C = new Function(core + "\nreturn VPNCORE;")();

const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
const b64url = (s) => b64(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const U = "11111111-2222-3333-4444-555555555555";
let pass = 0, failn = 0;
function check(name, cond, extra) {
  if (cond) pass++; else { failn++; console.log("FAIL:", name, extra !== undefined ? JSON.stringify(extra) : ""); }
}
const ob = (r) => r.config.outbounds[0];

// 1. VLESS TLS + WS, URL-encoded Persian + emoji name, params shuffled
const nameFa = "سرور 🇩🇪 آلمان";
const vless1 = `vless://${U}@example.com:443?path=%2Fws%3Fed%3D2048&security=tls&host=cdn.example.com&type=ws&sni=sni.example.com&fp=chrome&alpn=h2%2Chttp%2F1.1&allowInsecure=1&encryption=none#${encodeURIComponent(nameFa)}`;
let r = C.convertAll(vless1)[0];
check("vless ok", r.ok, r);
check("vless name", r.name === nameFa, r.name);
let o = ob(r);
check("vless id", o.settings.vnext[0].users[0].id === U);
check("vless addr/port", o.settings.vnext[0].address === "example.com" && o.settings.vnext[0].port === 443);
check("vless ws path decoded", o.streamSettings.wsSettings.path === "/ws?ed=2048", o.streamSettings.wsSettings);
check("vless ws host", o.streamSettings.wsSettings.headers.Host === "cdn.example.com");
check("vless tls", o.streamSettings.security === "tls" && o.streamSettings.tlsSettings.serverName === "sni.example.com"
  && o.streamSettings.tlsSettings.fingerprint === "chrome" && o.streamSettings.tlsSettings.allowInsecure === true
  && JSON.stringify(o.streamSettings.tlsSettings.alpn) === '["h2","http/1.1"]', o.streamSettings.tlsSettings);
check("vless no warnings", r.warnings.length === 0, r.warnings);
check("remarks field", r.config.remarks === nameFa);

// 1b. VLESS reality + flow, IPv6, grpc
const real = `vless://${U}@[2001:db8::1]:8443?type=tcp&security=reality&pbk=PUBKEY123&sid=ab12&sni=www.microsoft.com&fp=chrome&flow=xtls-rprx-vision&spx=%2F#R`;
r = C.convertAll(real)[0]; check("reality ok", r.ok, r);
o = ob(r);
check("reality fields", o.streamSettings.realitySettings.publicKey === "PUBKEY123" && o.streamSettings.realitySettings.shortId === "ab12"
  && o.streamSettings.realitySettings.spiderX === "/" && o.settings.vnext[0].users[0].flow === "xtls-rprx-vision"
  && o.settings.vnext[0].address === "2001:db8::1", o);
r = C.convertAll(`vless://${U}@h.com:443?type=grpc&serviceName=svc&mode=multi&security=tls&sni=h.com#g`)[0];
check("grpc", r.ok && ob(r).streamSettings.grpcSettings.serviceName === "svc" && ob(r).streamSettings.grpcSettings.multiMode === true, r);
r = C.convertAll(`vless://${U}@h.com:443?type=ws&security=tls&host=a.b&foo=bar#x`)[0];
check("unknown param warns", r.ok && r.warnings.some((w) => w.includes("foo")) && r.warnings.some((w) => w.includes("SNI")), r.warnings);

// 2. VMess base64 JSON (emoji + unicode name, url-safe, no padding variant)
const vj = { v: "2", ps: "وی‌مس 🚀 test", add: "vm.example.com", port: "443", id: U, aid: "0", scy: "auto", net: "ws", type: "none", host: "h.example.com", path: "/vmws", tls: "tls", sni: "vm.example.com", alpn: "h2", fp: "firefox" };
for (const enc of [b64(JSON.stringify(vj)), b64url(JSON.stringify(vj))]) {
  r = C.convertAll("vmess://" + enc)[0];
  check("vmess ok", r.ok, r);
  o = ob(r);
  check("vmess fields", r.name === vj.ps && o.settings.vnext[0].port === 443 && o.settings.vnext[0].users[0].security === "auto"
    && o.streamSettings.wsSettings.path === "/vmws" && o.streamSettings.wsSettings.headers.Host === "h.example.com"
    && o.streamSettings.tlsSettings.serverName === "vm.example.com" && o.streamSettings.tlsSettings.fingerprint === "firefox", o);
}
// vmess grpc & kcp & numeric port
r = C.convertAll("vmess://" + b64(JSON.stringify({ add: "g.com", port: 8443, id: U, net: "grpc", path: "svc", type: "multi", tls: "tls" })))[0];
check("vmess grpc", r.ok && ob(r).streamSettings.grpcSettings.serviceName === "svc" && ob(r).streamSettings.grpcSettings.multiMode === true, r);
r = C.convertAll("vmess://" + b64(JSON.stringify({ add: "k.com", port: 1234, id: U, net: "kcp", type: "wechat-video", path: "seedx" })))[0];
check("vmess kcp", r.ok && ob(r).streamSettings.kcpSettings.seed === "seedx" && ob(r).streamSettings.kcpSettings.header.type === "wechat-video", r);

// 3. Shadowsocks: SIP002 base64, legacy, plain, 2022, plugin, old cipher
const ssCred = b64url("aes-256-gcm:p@ss:word");
r = C.convertAll(`ss://${ssCred}@1.2.3.4:8388/#${encodeURIComponent("SS 🔒 نام")}`)[0];
check("ss sip002", r.ok && ob(r).settings.servers[0].method === "aes-256-gcm" && ob(r).settings.servers[0].password === "p@ss:word"
  && ob(r).settings.servers[0].address === "1.2.3.4" && r.name === "SS 🔒 نام", r);
r = C.convertAll("ss://" + b64("chacha20-ietf-poly1305:secret@legacy.example.com:443") + "#legacy")[0];
check("ss legacy", r.ok && ob(r).settings.servers[0].address === "legacy.example.com" && ob(r).settings.servers[0].password === "secret", r);
r = C.convertAll("ss://2022-blake3-aes-128-gcm:" + encodeURIComponent("c2VydmVy+/==") + "@2022.example.com:9000#p")[0];
check("ss 2022 plain", r.ok && ob(r).settings.servers[0].password === "c2VydmVy+/==" && ob(r).settings.servers[0].method === "2022-blake3-aes-128-gcm", r);
r = C.convertAll(`ss://${ssCred}@1.2.3.4:8388/?plugin=${encodeURIComponent("v2ray-plugin;tls;host=x.com")}#pl`)[0];
check("ss plugin rejected", !r.ok && /plugin/.test(r.error) && r.link.startsWith("ss://"), r);
r = C.convertAll(`ss://${b64url("aes-256-cfb:pw")}@1.2.3.4:8388#old`)[0];
check("ss old cipher rejected", !r.ok && /not supported/.test(r.error), r);

// 4. Trojan TLS (+ ws), password with special chars
r = C.convertAll(`trojan://${encodeURIComponent("p@ss/w#rd")}@tj.example.com:443?security=tls&sni=tj.example.com&type=ws&path=%2Ftj&host=tj.example.com&alpn=h2#${encodeURIComponent("تروجان 🐴")}`)[0];
check("trojan ok", r.ok && ob(r).settings.servers[0].password === "p@ss/w#rd" && ob(r).streamSettings.wsSettings.path === "/tj"
  && ob(r).streamSettings.tlsSettings.serverName === "tj.example.com" && r.name === "تروجان 🐴", r);
r = C.convertAll("trojan://pw@tj.example.com:443#plain")[0];
check("trojan default tls + warn", r.ok && ob(r).streamSettings.security === "tls" && r.warnings.length === 1, r);

// 5. Multiple links: separate entries, order, blank lines, CRLF
const multi = [vless1, "", "vmess://" + b64(JSON.stringify(vj)), `ss://${ssCred}@1.2.3.4:8388#a`, "trojan://pw@t.com:443#b"].join("\r\n");
const rs = C.convertAll(multi);
check("multi count", rs.length === 4 && rs.every((x) => x.ok), rs.map((x) => x.error));
check("multi distinct", new Set(rs.map((x) => x.name)).size === 4);
check("multi line numbers", rs.map((x) => x.line).join() === "1,3,4,5", rs.map((x) => x.line));

// 6. Invalid / incomplete
const bad = [
  ["vless://", /@/],
  [`vless://${U}@example.com#nop`, /Port/i],
  [`vless://${U}@example.com:99999?type=tcp`, /out of range/],
  [`vless://${U}@example.com:abc`, /Invalid port/],
  [`vless://@example.com:443`, /empty/],
  [`vless://${U}@example.com:443?type=quic`, /quic/],
  [`vless://${U}@example.com:443?security=reality&type=tcp`, /pbk/],
  [`vless://${U}@example.com:443?security=xtls`, /Unsupported security/],
  [`vless://${U}@example.com:443?type=ws&extra=1&security=tls&sni=a#%E0%A4%A`, null], // malformed % in name must not crash
  ["vmess://!!!notbase64!!!", /Base64/],
  ["vmess://" + b64("not json"), /JSON/],
  ["vmess://" + b64(JSON.stringify({ port: 1, id: U })), /add/],
  ["vmess://" + b64(JSON.stringify({ add: "a.com", port: 70000, id: U })), /out of range/],
  ["vmess://abcde", /Base64/],
  ["trojan://a.com:443", /@/],
  ["ss://", /Base64/],
  ["ss://" + b64url("onlymethod") + "@a.com:1", /method:password/],
  ["hysteria2://x@a.com:443", /Unsupported protocol/],
  ["just some text", /Not a valid link/],
];
for (const [link, re] of bad) {
  const x = C.convertAll(link)[0];
  if (re === null) check("malformed % no crash", x !== undefined && (x.ok || typeof x.error === "string"), x);
  else check("bad: " + link.slice(0, 40), x && !x.ok && re.test(x.error) && x.link === link, x);
}
// bad lines do not affect good ones
const mixed = C.convertAll([vless1, "vmess://!!!", "trojan://pw@t.com:443#ok"].join("\n"));
check("mixed", mixed[0].ok && !mixed[1].ok && mixed[2].ok && mixed[1].line === 2, mixed.map((m) => m.ok));

// 7. JSON validity + required config structure for everything that converted
for (const x of rs.concat(mixed.filter((m) => m.ok))) {
  const text = C.toJson(x.config);
  let back; try { back = JSON.parse(text); } catch (e) { back = null; }
  check("json valid " + x.name, back && Array.isArray(back.inbounds) && Array.isArray(back.outbounds) && back.routing && back.outbounds[0].tag === "proxy"
    && back.inbounds.some((i) => i.protocol === "socks" && i.port === 10808), x.name);
}

// 8. ZIP: write out for external verification
const files = rs.map((x, i) => ({ name: C.fileNameFor(x, i), text: C.toJson(x.config) }));
fs.writeFileSync("/tmp/test.zip", Buffer.from(C.makeZip(files)));
fs.writeFileSync("/tmp/zipnames.json", JSON.stringify(files.map((f) => [f.name, f.text.length])));

console.log(`passed ${pass}, failed ${failn}`);
process.exit(failn ? 1 : 0);
