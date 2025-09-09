
class AbrigoAnimais {
  constructor() {
    // dados fixos dos animais
    this.animaisData = {
      'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
    };

    // brinquedos válidos no sistema
    this.brinquedosValidos = new Set([
      'RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE'
    ]);
  }

  // validação: brinquedos duplicados ou inválidos
  normalizarEValidarBrinquedos(input) {
    const itens = input.split(',').map(item => item.trim().toUpperCase());
    const setItens = new Set();
    
    for (const item of itens) {
      if (!item || !this.brinquedosValidos.has(item)) {
        throw new Error('Brinquedo inválido');
      }
      if (setItens.has(item)) {
        throw new Error('Brinquedo duplicado');
      }
      setItens.add(item);
    }
    return itens;
  }

  // validação: animais duplicados ou inexistentes
  validarAnimais(ordemAnimais) {
    const ordem = ordemAnimais.split(',').map(item => item.trim());
    const ordemSet = new Set(ordem);

    if (ordemSet.size !== ordem.length) {
      return { erro: 'Animal inválido' };
    }

    for (const animal of ordem) {
      if (!this.animaisData[animal]) {
        return { erro: 'Animal inválido' };
      }
    }

    return ordem;
  }

  // logica principal: quem pode adotar cada animal
  pessoaPodeAdotar(animalNome, brinquedosPessoa) {
    const animalData = this.animaisData[animalNome];
    const animalBrinquedos = animalData.brinquedos;
    const animalTipo = animalData.tipo;

    // regra 3: Gatos exigem ordem exata 
    if (animalTipo === 'gato') {
      let brinquedosFiltrados = brinquedosPessoa.filter(brinquedo => 
        animalBrinquedos.includes(brinquedo)
      );
      return JSON.stringify(brinquedosFiltrados) === JSON.stringify(animalBrinquedos);
    }

    // regra 2: Outros animais 
    let brinquedoIdx = 0;
    for (const brinquedoPessoa of brinquedosPessoa) {
      if (brinquedoPessoa === animalBrinquedos[brinquedoIdx]) {
        brinquedoIdx++;
        if (brinquedoIdx === animalBrinquedos.length) {
          return true;
        }
      }
    }
    return false;
  }

  // método específico para o Loco
  pessoaPodeAdotarLoco(brinquedosPessoa, resultados) {
    const animalBrinquedos = this.animaisData['Loco'].brinquedos;
    
    // verifica se há companhia (algum animal já adotado)
    const temCompanhia = resultados.some(resultado => !resultado.includes('abrigo'));
    
    if (temCompanhia) {
      // Loco não liga para ordem, só precisa ter os brinquedos
      return animalBrinquedos.every(brinquedo => brinquedosPessoa.includes(brinquedo));
    }
    return false;
  }

  // método principal
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    try {
      // valida brinquedos das pessoas
      const p1Brinquedos = this.normalizarEValidarBrinquedos(brinquedosPessoa1);
      const p2Brinquedos = this.normalizarEValidarBrinquedos(brinquedosPessoa2);

      // valida lista de animais
      const ordem = this.validarAnimais(ordemAnimais);
      if (ordem.erro) return ordem;

      const resultados = [];
      let adotadosP1 = 0;
      let adotadosP2 = 0;

      // PRIMEIRO: processa todos os animais EXCETO o Loco
      const animaisNormais = ordem.filter(animal => animal !== 'Loco');
      
      for (const animalNome of animaisNormais) {
        const p1Pode = this.pessoaPodeAdotar(animalNome, p1Brinquedos);
        const p2Pode = this.pessoaPodeAdotar(animalNome, p2Brinquedos);

        // regra 5: limite de 3 animais por pessoa
        const p1PodeELimite = p1Pode && adotadosP1 < 3;
        const p2PodeELimite = p2Pode && adotadosP2 < 3;

        // regra 4: empate → animal fica no abrigo
        if (p1PodeELimite && p2PodeELimite) {
          resultados.push(`${animalNome} - abrigo`);
        } 
        else if (p1PodeELimite) {
          resultados.push(`${animalNome} - pessoa 1`);
          adotadosP1++;
        } 
        else if (p2PodeELimite) {
          resultados.push(`${animalNome} - pessoa 2`);
          adotadosP2++;
        } 
        else {
          resultados.push(`${animalNome} - abrigo`);
        }
      }

      // SEGUNDO: processa o Loco (se existir na lista)
      if (ordem.includes('Loco')) {
        const locoPodeP1 = this.pessoaPodeAdotarLoco(p1Brinquedos, resultados);
        const locoPodeP2 = this.pessoaPodeAdotarLoco(p2Brinquedos, resultados);

        const locoP1Limite = locoPodeP1 && adotadosP1 < 3;
        const locoP2Limite = locoPodeP2 && adotadosP2 < 3;

        if (locoP1Limite && locoP2Limite) {
          resultados.push('Loco - abrigo');
        }
        else if (locoP1Limite) {
          resultados.push('Loco - pessoa 1');
          adotadosP1++;
        }
        else if (locoP2Limite) {
          resultados.push('Loco - pessoa 2');
          adotadosP2++;
        }
        else {
          resultados.push('Loco - abrigo');
        }
      }

      // ordena resultados alfabeticamente
      resultados.sort((a, b) => {
        const nomeA = a.split(' - ')[0];
        const nomeB = b.split(' - ')[0];
        return nomeA.localeCompare(nomeB);
      });

      return { lista: resultados };

    } catch (error) {
      // captura erros de brinquedos inválidos/duplicados
      if (error.message === 'Brinquedo inválido' || error.message === 'Brinquedo duplicado') {
        return { erro: 'Brinquedo inválido' };
      }
      throw error; // repassa outros erros inesperados
    }
  }
}

export { AbrigoAnimais as AbrigoAnimais };