import React, { useEffect, useState } from 'react';

// Ethical Guardian — Protótipo React (adaptado para Vite + Tailwind CDN)

const SUPPORTED_LANGS = [
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

const DEFAULT_TRANSLATIONS = {
  'pt-BR': { appTitle: 'Ethical Guardian', sos: 'SOCORRO', report: 'Denunciar (manual)', info: 'Informar & Detectar', settings: 'Configurações', history: 'Histórico', addContact: 'Adicionar contato de confiança', silentMode: 'Denúncia silenciosa (por palavra-chave)', penaTitle: 'Pena de ESI', artExpl: 'Artigo legal (resumo)', leiInfo: 'LEI Nº 13.431, DE 4 DE ABRIL DE 2017', trustedLabel: 'Contatos de confiança', markReliable: 'Marcar como mais confiável', remove: 'Remover', edit: 'Editar', favorite: 'Mais confiável', online: 'Online', offline: 'Offline', language: 'Idioma', keywordPlaceholder: "Escreva palavra-chave... (ex: 'socorro')", silentKeywordPlaceholder: "Palavra-chave silenciosa...", send: 'Enviar', cancel: 'Cancelar', delete: 'Apagar', selectReliable: 'Selecionar contato mais confiável', eraseNumber: 'Apagar número', explainLaw: 'A lei dispõe sobre o sistema de garantia de direitos da criança e do adolescente vítima ou testemunha de violência.' },
  en: { appTitle: 'Ethical Guardian', sos: 'SOS', report: 'Report', info: 'Inform & Detect', settings: 'Settings', history: 'History', addContact: 'Add trusted contact', silentMode: 'Silent report (keyword)', penaTitle: 'ESI Penalty', artExpl: 'Legal article', leiInfo: 'LAW Nº 13.431, APR 4, 2017', trustedLabel: 'Trusted contacts', markReliable: 'Mark as most reliable', remove: 'Remove', edit: 'Edit', favorite: 'Most reliable', online: 'Online', offline: 'Offline', language: 'Language', keywordPlaceholder: "Type keyword...", silentKeywordPlaceholder: "Silent keyword...", send: 'Send', cancel: 'Cancel', delete: 'Delete', selectReliable: 'Select most reliable contact', eraseNumber: 'Erase number', explainLaw: 'The law provides the system guaranteeing rights of child/adolescent victims or witnesses of violence.' },
  es: { appTitle: 'Ethical Guardian', sos: '¡SOCORRO!', report: 'Denunciar', info: 'Informar y Detectar', settings: 'Configuración', history: 'Historial', addContact: 'Agregar contacto de confianza', silentMode: 'Denuncia silenciosa', penaTitle: 'Pena por ESI', artExpl: 'Artículo legal', leiInfo: 'LEI Nº 13.431, 4 DE ABRIL DE 2017', trustedLabel: 'Contactos de confianza', markReliable: 'Marcar como más confiável', remove: 'Eliminar', edit: 'Editar', favorite: 'Más confiável', online: 'Conectado', offline: 'Sin conexión', language: 'Idioma', keywordPlaceholder: "Escriba palabra clave...", silentKeywordPlaceholder: "Palabra silenciosa...", send: 'Enviar', cancel: 'Cancelar', delete: 'Borrar', selectReliable: 'Seleccionar contacto más fiable', eraseNumber: 'Borrar número', explainLaw: 'La ley dispone sobre el sistema de garantía de derechos de la criança y adolescente víctima o testigo de violencia.' }
};

const DEFAULT_CONTACTS = [
  { id: 1, name: 'Polícia - Linha Direta', phone: '+55 190', reliable: true },
  { id: 2, name: 'Vizinha Ana', phone: '+55 11 90000-0001', reliable: false },
  { id: 3, name: 'Amigo João', phone: '+55 11 90000-0002', reliable: false }
];

export default function App() {
  const [language, setLanguage] = useState('pt-BR');
  const [translations] = useState(DEFAULT_TRANSLATIONS);
  const [darkMode, setDarkMode] = useState(true);
  const [online, setOnline] = useState(navigator.onLine);
  const [alerts, setAlerts] = useState([]);

  // contacts state with robust editing management
  const [trustedContacts, setTrustedContacts] = useState(DEFAULT_CONTACTS);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', phone: '' });

  const [manualReport, setManualReport] = useState({ description: '', street: '', number: '', city: '' });
  const [keyword, setKeyword] = useState('');
  const [silentKeyword, setSilentKeyword] = useState('');
  const [silentModeActive, setSilentModeActive] = useState(false);

  useEffect(() => {
    function goOnline() { setOnline(true); }
    function goOffline() { setOnline(false); }
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); };
  }, []);

  function t(key) { return (translations[language] && translations[language][key]) || key; }

  function pushAlert(a) { setAlerts(prev => [a, ...prev].slice(0, 200)); }

  function sendToAllRecipients(payload) {
    const timestamp = new Date().toISOString();
    const police = trustedContacts.find(c => c.name.toLowerCase().includes('polícia') || c.name.toLowerCase().includes('police'));
    const contactsToNotify = trustedContacts.map(c => ({ id: c.id, name: c.name, phone: c.phone, reliable: c.reliable }));
    const entry = { ...payload, time: timestamp, police: police || null, contacts: contactsToNotify, sentOnline: online };
    pushAlert(entry);
    console.log('Simulated send:', entry);
    alert(`${t('sos')} — alerta enviado (simulado)
Hora: ${new Date(timestamp).toLocaleString()}`);
  }

  function handleSOS() {
    if (!navigator.geolocation) { sendToAllRecipients({ method: 'SOCORRO', coords: null, note: 'GPS não suportado' }); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => sendToAllRecipients({ method: 'SOCORRO', coords: { lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy } }),
      (err) => sendToAllRecipients({ method: 'SOCORRO', coords: null, note: 'GPS falhou: ' + err.message }),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function handleManualSend() {
    const payload = { method: 'DENUNCIA_MANUAL', data: manualReport };
    sendToAllRecipients(payload);
    setManualReport({ description: '', street: '', number: '', city: '' });
  }

  const KEYWORDS = ['tudo bem', 'eu tô com fome', 'para', 'socorro'];

  function processKeyword(txt, mode = 'normal') {
    const cleaned = (txt || '').toLowerCase().trim();
    if (KEYWORDS.includes(cleaned)) {
      const payload = { method: mode === 'silent' ? 'DENUNCIA_SILENCIOSA' : 'PALAVRA_CHAVE', keyword: cleaned };
      sendToAllRecipients(payload);
      return true;
    }
    return false;
  }

  function handleKeywordSubmit() { if (!processKeyword(keyword, 'normal')) alert('Palavra-chave não reconhecida.'); else setKeyword(''); }
  function handleSilentKeywordSubmit() { if (!processKeyword(silentKeyword, 'silent')) alert('Palavra-chave silenciosa não reconhecida.'); else setSilentKeyword(''); }

  // --- Contacts management (fixed) ---
  function addContact() {
    // use prompt but ensure state update
    const name = prompt('Nome do contato (ex: Ana - Vizinha)');
    if (!name) return;
    const phone = prompt('Número (incluir código de país)');
    if (!phone) return;
    const newContact = { id: Date.now(), name: name.trim(), phone: phone.trim(), reliable: false };
    setTrustedContacts(prev => [newContact, ...prev]);
  }

  function startEditContact(id) {
    const c = trustedContacts.find(x => x.id === id);
    if (!c) return;
    setEditingId(id);
    setEditValues({ name: c.name, phone: c.phone });
  }

  function saveContact(id) {
    setTrustedContacts(prev => prev.map(c => c.id === id ? { ...c, name: editValues.name.trim(), phone: editValues.phone.trim(), editing: false } : c));
    setEditingId(null);
    setEditValues({ name: '', phone: '' });
  }

  function cancelEdit(id) {
    setEditingId(null);
    setEditValues({ name: '', phone: '' });
  }

  function removeContact(id) {
    if (!confirm('Remover contato?')) return;
    setTrustedContacts(prev => prev.filter(c => c.id !== id));
    if (editingId === id) cancelEdit(id);
  }

  function toggleReliable(id) {
    setTrustedContacts(prev => prev.map(c => c.id === id ? { ...c, reliable: !c.reliable } : c));
  }

  return (
    <div className={`${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} min-h-screen p-4`}>
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between mb-4">
          <div>
            <div className="text-xl font-bold">{t('appTitle')}</div>
            <div className="text-xs opacity-80">{t('leiInfo')}</div>
          </div>
          <div className="flex gap-2">
            <div className={`text-xs px-2 py-1 rounded ${online ? 'bg-green-600' : 'bg-yellow-600'}`}>{online ? t('online') : t('offline')}</div>
            <button onClick={() => setDarkMode(d => !d)} className="text-sm px-2 py-1 border rounded">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</button>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="ml-2 text-sm p-1 rounded">{SUPPORTED_LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}</select>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="md:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl" style={{ background: darkMode ? '#0b0b0b' : '#fff' }}>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{t('sos')}</div>
                <button onClick={handleSOS} className="px-6 py-3 rounded-full font-semibold bg-red-600 text-white">{t('sos')}</button>
              </div>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: darkMode ? '#0b0b0b' : '#fff' }}>
              <h3 className="font-semibold text-lg">{t('report')}</h3>
              <textarea placeholder="Descrição" value={manualReport.description} onChange={(e) => setManualReport({ ...manualReport, description: e.target.value })} className="w-full p-2 rounded mt-1" rows={4} />
              <div className="grid grid-cols-3 gap-2 mt-2">
                <input placeholder="Rua" value={manualReport.street} onChange={(e) => setManualReport({ ...manualReport, street: e.target.value })} className="p-2 rounded" />
                <input placeholder="Número/Bloco" value={manualReport.number} onChange={(e) => setManualReport({ ...manualReport, number: e.target.value })} className="p-2 rounded" />
                <input placeholder="Cidade" value={manualReport.city} onChange={(e) => setManualReport({ ...manualReport, city: e.target.value })} className="p-2 rounded" />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={handleManualSend} className="px-4 py-2 rounded bg-blue-600 text-white">{t('send')}</button>
                <button onClick={() => setManualReport({ description: '', street: '', number: '', city: '' })} className="px-4 py-2 rounded border">{t('cancel')}</button>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="p-3 rounded-2xl" style={{ background: darkMode ? '#0b0b0b' : '#fff' }}>
              <div className="flex justify-between items-center">
                <div className="font-semibold">{t('trustedLabel')}</div>
                <button onClick={addContact} className="text-sm px-2 py-1 border rounded">{t('addContact')}</button>
              </div>

              <div className="mt-2 space-y-2 text-sm">
                {trustedContacts.map(c => (
                  <div key={c.id} className="p-2 rounded flex flex-col gap-2" style={{ background: darkMode ? '#0f0f0f' : '#f8f8f8' }}>
                    {editingId === c.id ? (
                      <div className="flex flex-col gap-1">
                        <input className="p-1 rounded text-black" value={editValues.name} onChange={(e) => setEditValues(ev => ({ ...ev, name: e.target.value }))} />
                        <input className="p-1 rounded text-black" value={editValues.phone} onChange={(e) => setEditValues(ev => ({ ...ev, phone: e.target.value }))} />
                        <div className="flex gap-1">
                          <button className="px-2 py-1 border rounded" onClick={() => saveContact(c.id)}>Salvar</button>
                          <button className="px-2 py-1 border rounded" onClick={() => cancelEdit(c.id)}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{c.name} {c.reliable && <span className="text-xs opacity-80">· {t('favorite')}</span>}</div>
                          <div className="text-xs opacity-70">{c.phone}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button className="px-2 py-1 border rounded" onClick={() => toggleReliable(c.id)}>{c.reliable ? '✓' : '+'}</button>
                          <div className="flex gap-1">
                            <button className="px-2 py-1 border rounded" onClick={() => startEditContact(c.id)}>{t('edit')}</button>
                            <button className="px-2 py-1 border rounded" onClick={() => removeContact(c.id)}>{t('remove')}</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl" style={{ background: darkMode ? '#0b0b0b' : '#fff' }}>
              <div className="font-semibold">{t('silentMode')}</div>
              <div className="text-xs opacity-75 mt-2">Ative denúncia silenciosa por palavra-chave — quando detectada, o app enviará alertas sem emitir som. (Simulado para web; para app fechado requer versão nativa.)</div>
              <div className="mt-2 flex gap-2">
                <input placeholder={t('silentKeywordPlaceholder')} value={silentKeyword} onChange={(e) => setSilentKeyword(e.target.value)} className="flex-1 p-2 rounded" />
                <button onClick={handleSilentKeywordSubmit} className="px-3 py-2 rounded bg-yellow-600">{t('send')}</button>
              </div>
              <div className="mt-2 text-xs flex items-center gap-2"><label><input type="checkbox" checked={silentModeActive} onChange={(e) => setSilentModeActive(e.target.checked)} /> {t('silentMode')}</label></div>
            </div>

            <div className="p-3 rounded-2xl" style={{ background: darkMode ? '#0b0b0b' : '#fff' }}>
              <div className="flex justify-between items-center"><div className="font-semibold">{t('history')}</div><button onClick={() => setAlerts([])} className="text-xs">{t('delete')}</button></div>
              <div className="mt-2 text-xs max-h-48 overflow-auto">
                {alerts.length === 0 ? <div className="opacity-70">Nenhum alerta.</div> : alerts.map((a, i) => (
                  <div key={i} className="p-2 rounded mb-2" style={{ background: darkMode ? '#0f0f0f' : '#f4f4f4' }}>
                    <div className="text-[13px] font-medium">{a.method || a.keyword}</div>
                    <div className="text-[11px] opacity-70">{new Date(a.time).toLocaleString()} · {a.sentOnline ? 'enviado' : 'salvo local'}</div>
                    <div className="text-[11px] mt-1">{a.coords ? `Lat: ${a.coords.lat.toFixed(4)}, Lon: ${a.coords.lon.toFixed(4)}` : (a.note || '')}</div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </main>
      </div>
    </div>
  );
}
