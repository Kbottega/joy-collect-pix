// Geração de código PIX estático (Copia e Cola)
// Para MVP, geramos um PIX simples que pode ser copiado

interface PixParams {
  pixKey: string;
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'chave_aleatoria';
  merchantName: string;
  merchantCity: string;
  amount?: number;
  description?: string;
}

// Função auxiliar para calcular CRC16
function crc16(data: string): string {
  const polynomial = 0x1021;
  let result = 0xffff;

  for (let i = 0; i < data.length; i++) {
    result ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((result & 0x8000) !== 0) {
        result = (result << 1) ^ polynomial;
      } else {
        result <<= 1;
      }
    }
    result &= 0xffff;
  }

  return result.toString(16).toUpperCase().padStart(4, '0');
}

// Função para criar campo TLV (Tag-Length-Value)
function tlv(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${tag}${length}${value}`;
}

export function generatePixCode(params: PixParams): string {
  const {
    pixKey,
    merchantName,
    merchantCity,
    amount,
    description,
  } = params;

  // Payload Format Indicator
  let payload = tlv('00', '01');

  // Merchant Account Information (campo 26)
  let merchantAccountInfo = tlv('00', 'BR.GOV.BCB.PIX'); // GUI do PIX
  merchantAccountInfo += tlv('01', pixKey); // Chave PIX
  if (description) {
    merchantAccountInfo += tlv('02', description.substring(0, 25)); // Descrição (máx 25 chars)
  }
  payload += tlv('26', merchantAccountInfo);

  // Merchant Category Code
  payload += tlv('52', '0000');

  // Transaction Currency (Real = 986)
  payload += tlv('53', '986');

  // Transaction Amount (se especificado)
  if (amount && amount > 0) {
    payload += tlv('54', amount.toFixed(2));
  }

  // Country Code
  payload += tlv('58', 'BR');

  // Merchant Name (máx 25 chars)
  payload += tlv('59', merchantName.substring(0, 25).toUpperCase());

  // Merchant City (máx 15 chars)
  payload += tlv('60', merchantCity.substring(0, 15).toUpperCase());

  // CRC16 placeholder - será calculado no final
  payload += '6304';

  // Calcula CRC16
  const crc = crc16(payload);
  payload = payload.slice(0, -4) + tlv('63', crc);

  return payload;
}

// Formatar chave PIX para exibição
export function formatPixKey(key: string, type: string): string {
  switch (type) {
    case 'cpf':
      return key.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    case 'telefone':
      return key.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    default:
      return key;
  }
}
