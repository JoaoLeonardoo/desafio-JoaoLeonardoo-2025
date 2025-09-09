import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais', () => {

  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
    expect(resultado.erro).toBe('Animal inválido');
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
    expect(resultado.lista).toEqual(['Fofo - abrigo', 'Rex - pessoa 1']);
  });

  test('Deve encontrar pessoa para animal com brinquedos intercalados', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'BOLA,LASER', 'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola'
    );
    expect(resultado.lista).toEqual(['Bola - abrigo', 'Fofo - pessoa 2', 'Mimi - abrigo', 'Rex - abrigo']);
  });

  test('Deve rejeitar animal duplicado', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Rex,Rex');
    expect(resultado.erro).toBe('Animal inválido');
  });

  test('Deve rejeitar animal inexistente', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'AnimalInexistente');
    expect(resultado.erro).toBe('Animal inválido');
  });

  test('Loco deve ser adotado com companhia', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA,SKATE',  // Pessoa 1 tem brinquedos do Rex e Loco
      'RATO,BOLA',        // Pessoa 2
      'Rex,Loco'          // Rex é adotado primeiro → dá companhia ao Loco
    );
    expect(resultado.lista).toContain('Loco - pessoa 1');
    expect(resultado.lista).toContain('Rex - pessoa 1');
  });

  test('Loco deve ser adotado com companhia', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
    'RATO,BOLA,SKATE',  // Pessoa 1 tem brinquedos do Rex e Loco
    'RATO',             // Pessoa 2 NÃO tem todos brinquedos do Rex (falta BOLA)
    'Rex,Loco'          // Só Pessoa 1 pode adotar Rex → dá companhia ao Loco
    );
    expect(resultado.lista).toContain('Loco - pessoa 1');
    expect(resultado.lista).toContain('Rex - pessoa 1');
  });

  test('Deve rejeitar brinquedo inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,INVALIDO', 'RATO,BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve rejeitar brinquedo duplicado', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,RATO', 'RATO,BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

});