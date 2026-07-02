// script.js - Missão IA: gerador de senhas com entropia e feedback inteligente
document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const lengthInput = document.getElementById('length');
  const useUpper = document.getElementById('useUpper');
  const useLower = document.getElementById('useLower');
  const useNumbers = document.getElementById('useNumbers');
  const useSymbols = document.getElementById('useSymbols');
  const useAI = document.getElementById('useAI');
  const generateBtn = document.getElementById('generateBtn');
  const passwordOutput = document.getElementById('passwordOutput');
  const entropyValue = document.getElementById('entropyValue');
  const entropyLevel = document.getElementById('entropyLevel');
  const aiMessage = document.getElementById('aiMessage');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const copyBtn = document.getElementById('copyBtn');

  // Conjuntos de caracteres
  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?/';

  // Mensagens da IA (feedback)
  const aiMessages = {
    weak: '🤔 Essa senha é fraca. A IA quebra em segundos. Aumente o comprimento ou use mais tipos.',
    medium: '😐 Segurança média. A IA levaria horas. Adicione símbolos e números.',
    strong: '😊 Boa! Entropia alta. IA levaria anos para quebrar.',
    veryStrong: '🔥 Excelente! Nível quântico. IA não consegue decifrar com recursos atuais.',
    perfect: '🏆 PERFEITA! Entropia máxima. A IA se rende.'
  };

  // Função para gerar senha
  function generatePassword() {
    let charset = '';
    if (useUpper.checked) charset += UPPER;
    if (useLower.checked) charset += LOWER;
    if (useNumbers.checked) charset += NUMBERS;
    if (useSymbols.checked) charset += SYMBOLS;

    if (charset === '') {
      alert('Selecione pelo menos um tipo de caractere!');
      return '';
    }

    let length = parseInt(lengthInput.value, 10);
    if (isNaN(length) || length < 6) {
      alert('Comprimento mínimo: 6 caracteres.');
      return '';
    }
    if (length > 32) {
      alert('Comprimento máximo: 32 caracteres.');
      return '';
    }

    // Modo IA: se ativado, prioriza maior entropia e diversificação
    if (useAI.checked) {
      // IA "otimiza" garantindo que todos os tipos selecionados apareçam pelo menos uma vez
      // E também escolhe um comprimento ligeiramente maior se possível
      const aiLength = Math.min(length + 1, 32); // adiciona 1 caractere para melhorar entropia
      // Mas mantém o comprimento original se já for 32
      const finalLength = (length < 32) ? aiLength : length;
      // A IA gera uma senha que contém todos os tipos selecionados
      let password = '';
      const selectedTypes = [];
      if (useUpper.checked) selectedTypes.push(UPPER);
      if (useLower.checked) selectedTypes.push(LOWER);
      if (useNumbers.checked) selectedTypes.push(NUMBERS);
      if (useSymbols.checked) selectedTypes.push(SYMBOLS);

      // Garante pelo menos um de cada tipo selecionado
      for (const type of selectedTypes) {
        const randomIndex = Math.floor(Math.random() * type.length);
        password += type[randomIndex];
      }

      // Preenche o resto com caracteres aleatórios
      const allChars = charset.split('');
      for (let i = password.length; i < finalLength; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
      }

      // Embaralha para não ficar previsível
      password = password.split('').sort(() => Math.random() - 0.5).join('');
      return password;
    } else {
      // Modo normal (sem IA)
      const charsetArray = charset.split('');
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetArray.length);
        password += charsetArray[randomIndex];
      }
      return password;
    }
  }

  // Calcular entropia (bits) = L * log2(C)
  function calculateEntropy(password, charsetSize) {
    if (!password || password.length === 0 || charsetSize === 0) return 0;
    return password.length * Math.log2(charsetSize);
  }

  // Tamanho do conjunto de caracteres
  function getCharsetSize() {
    let size = 0;
    if (useUpper.checked) size += UPPER.length;
    if (useLower.checked) size += LOWER.length;
    if (useNumbers.checked) size += NUMBERS.length;
    if (useSymbols.checked) size += SYMBOLS.length;
    return size;
  }

  // Avaliar força da senha e gerar feedback da IA
  function getAILevel(entropy) {
    if (entropy < 40) return { level: 'weak', emoji: '🔴', msg: aiMessages.weak };
    if (entropy < 60) return { level: 'medium', emoji: '🟡', msg: aiMessages.medium };
    if (entropy < 80) return { level: 'strong', emoji: '🟢', msg: aiMessages.strong };
    if (entropy < 100) return { level: 'veryStrong', emoji: '🟣', msg: aiMessages.veryStrong };
    return { level: 'perfect', emoji: '🏆', msg: aiMessages.perfect };
  }

  // Atualizar barra de progresso (baseado na entropia, max 120 bits)
  function updateProgress(entropy) {
    const maxEntropy = 120;
    let percent = Math.min((entropy / maxEntropy) * 100, 100);
    percent = Math.max(percent, 0);
    progressFill.style.width = percent + '%';
    progressText.textContent = Math.round(percent) + '%';
  }

  // Função principal: gerar e atualizar tudo
  function updatePassword() {
    const password = generatePassword();
    if (password === '') return;

    passwordOutput.value = password;
    const charsetSize = getCharsetSize();
    const entropy = calculateEntropy(password, charsetSize);
    entropyValue.textContent = entropy.toFixed(1);

    // Feedback da IA
    const aiResult = getAILevel(entropy);
    entropyLevel.textContent = aiResult.emoji;
    aiMessage.textContent = aiResult.msg;

    // Progresso
    updateProgress(entropy);

    // Adiciona classe de destaque se for muito forte
    if (entropy >= 80) {
      passwordOutput.style.borderColor = '#b380ff';
      passwordOutput.style.boxShadow = '0 0 12px rgba(160, 80, 255, 0.3)';
    } else {
      passwordOutput.style.borderColor = '#6b3faf';
      passwordOutput.style.boxShadow = 'none';
    }
  }

  // Eventos
  generateBtn.addEventListener('click', updatePassword);

  // Copiar
  copyBtn.addEventListener('click', () => {
    const password = passwordOutput.value;
    if (!password) {
      alert('Gere uma senha primeiro.');
      return;
    }
    navigator.clipboard.writeText(password).then(() => {
      copyBtn.textContent = '✅';
      setTimeout(() => {
        copyBtn.textContent = '📋';
      }, 1200);
    }).catch(() => {
      passwordOutput.select();
      document.execCommand('copy');
      copyBtn.textContent = '✅';
      setTimeout(() => {
        copyBtn.textContent = '📋';
      }, 1200);
    });
  });

  // Atualizar entropia (sem regenerar) quando opções mudarem
  function refreshEntropyDisplay() {
    const currentPassword = passwordOutput.value;
    if (currentPassword && currentPassword.length > 0) {
      const charsetSize = getCharsetSize();
      if (charsetSize === 0) {
        entropyValue.textContent = '0.0';
        entropyLevel.textContent = '⛔';
        aiMessage.textContent = 'Selecione pelo menos um tipo de caractere.';
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        return;
      }
      const entropy = calculateEntropy(currentPassword, charsetSize);
      entropyValue.textContent = entropy.toFixed(1);
      const aiResult = getAILevel(entropy);
      entropyLevel.textContent = aiResult.emoji;
      aiMessage.textContent = aiResult.msg;
      updateProgress(entropy);
    } else {
      entropyValue.textContent = '—';
      entropyLevel.textContent = '🔒';
      aiMessage.textContent = 'Aguardando geração...';
      progressFill.style.width = '0%';
      progressText.textContent = '0%';
    }
  }

  // Listeners para atualizar exibição
  useUpper.addEventListener('change', refreshEntropyDisplay);
  useLower.addEventListener('change', refreshEntropyDisplay);
  useNumbers.addEventListener('change', refreshEntropyDisplay);
  useSymbols.addEventListener('change', refreshEntropyDisplay);
  useAI.addEventListener('change', refreshEntropyDisplay);
  lengthInput.addEventListener('change', refreshEntropyDisplay);
  lengthInput.addEventListener('input', refreshEntropyDisplay);

  // Inicializar com uma senha
  updatePassword();

  // Atualiza se a senha for alterada manualmente (raro)
  passwordOutput.addEventListener('input', refreshEntropyDisplay);
});
