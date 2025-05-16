// // src/db/indexedDB.js

// // Nome do banco de dados e versão
// const DB_NAME = 'RallyCarbonoDB';
// const DB_VERSION = 1;

// // Nome das object stores
// const VEHICLES_STORE = 'vehicles';
// const SYNC_STATUS_STORE = 'syncStatus';

// // Função para inicializar o banco de dados
// export const initDB = () => {
//   return new Promise((resolve, reject) => {
//     // Abrir ou criar o banco de dados
//     const request = indexedDB.open(DB_NAME, DB_VERSION);

//     // Executado quando a estrutura do banco de dados precisa ser criada/atualizada
//     request.onupgradeneeded = (event) => {
//       const db = event.target.result;

//       // Criar object store para veículos se não existir
//       if (!db.objectStoreNames.contains(VEHICLES_STORE)) {
//         const vehiclesStore = db.createObjectStore(VEHICLES_STORE, { keyPath: 'id', autoIncrement: true });
        
//         // Criar índices para busca
//         vehiclesStore.createIndex('name', 'name', { unique: false });
//         vehiclesStore.createIndex('number', 'number', { unique: false });
//         vehiclesStore.createIndex('team', 'team', { unique: false });
//         vehiclesStore.createIndex('pilot', 'pilot', { unique: false });
//       }

//       // Criar object store para status de sincronização
//       if (!db.objectStoreNames.contains(SYNC_STATUS_STORE)) {
//         const syncStatusStore = db.createObjectStore(SYNC_STATUS_STORE, { keyPath: 'id' });
//         // Adicionar registro inicial
//         syncStatusStore.add({ id: 1, lastSync: null, pendingChanges: [] });
//       }
//     };

//     // Chamado quando o banco de dados é aberto com sucesso
//     request.onsuccess = (event) => {
//       const db = event.target.result;
//       resolve(db);
//     };

//     // Chamado quando ocorre um erro ao abrir o banco de dados
//     request.onerror = (event) => {
//       reject(`Erro ao abrir banco de dados: ${event.target.error}`);
//     };
//   });
// };

// // Função para adicionar um veículo
// export const addVehicle = async (vehicleData) => {
//   const db = await initDB();
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
//     const store = transaction.objectStore(VEHICLES_STORE);
    
//     // Adicionar UUID para identificação única entre dispositivos
//     const vehicleWithId = {
//       ...vehicleData,
//       deviceId: getDeviceId(),
//       updatedAt: new Date().toISOString(),
//       synced: false
//     };
    
//     const request = store.add(vehicleWithId);
    
//     request.onsuccess = (event) => {
//       resolve({ ...vehicleWithId, id: event.target.result });
//     };
    
//     request.onerror = (event) => {
//       reject(`Erro ao adicionar veículo: ${event.target.error}`);
//     };
    
//     transaction.oncomplete = () => {
//       db.close();
//     };
//   });
// };

// // Função para atualizar um veículo
// export const updateVehicle = async (id, vehicleData) => {
//   const db = await initDB();
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
//     const store = transaction.objectStore(VEHICLES_STORE);
    
//     // Primeiro, buscar o veículo atual
//     const getRequest = store.get(id);
    
//     getRequest.onsuccess = (event) => {
//       const existingVehicle = event.target.result;
//       if (!existingVehicle) {
//         reject(`Veículo com ID ${id} não encontrado`);
//         return;
//       }
      
//       // Atualizar os dados
//       const updatedVehicle = {
//         ...existingVehicle,
//         ...vehicleData,
//         updatedAt: new Date().toISOString(),
//         synced: false
//       };
      
//       const updateRequest = store.put(updatedVehicle);
      
//       updateRequest.onsuccess = () => {
//         resolve(updatedVehicle);
//       };
      
//       updateRequest.onerror = (event) => {
//         reject(`Erro ao atualizar veículo: ${event.target.error}`);
//       };
//     };
    
//     getRequest.onerror = (event) => {
//       reject(`Erro ao buscar veículo: ${event.target.error}`);
//     };
    
//     transaction.oncomplete = () => {
//       db.close();
//     };
//   });
// };

// // Função para obter todos os veículos
// export const getAllVehicles = async () => {
//   const db = await initDB();
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction([VEHICLES_STORE], 'readonly');
//     const store = transaction.objectStore(VEHICLES_STORE);
//     const request = store.getAll();
    
//     request.onsuccess = (event) => {
//       resolve(event.target.result);
//     };
    
//     request.onerror = (event) => {
//       reject(`Erro ao buscar veículos: ${event.target.error}`);
//     };
    
//     transaction.oncomplete = () => {
//       db.close();
//     };
//   });
// };

// // Função para buscar um veículo pelo ID
// export const getVehicleById = async (id) => {
//   const db = await initDB();
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction([VEHICLES_STORE], 'readonly');
//     const store = transaction.objectStore(VEHICLES_STORE);
//     const request = store.get(id);
    
//     request.onsuccess = (event) => {
//       resolve(event.target.result);
//     };
    
//     request.onerror = (event) => {
//       reject(`Erro ao buscar veículo: ${event.target.error}`);
//     };
    
//     transaction.oncomplete = () => {
//       db.close();
//     };
//   });
// };

// // Função para buscar veículos por critérios
// export const searchVehicles = async (criteria) => {
//   const allVehicles = await getAllVehicles();
  
//   // Filtrar veículos de acordo com os critérios
//   return allVehicles.filter(vehicle => {
//     // Verificar correspondência em cada critério fornecido
//     for (const [key, value] of Object.entries(criteria)) {
//       if (value && vehicle[key]) {
//         const vehicleValue = vehicle[key].toString().toLowerCase();
//         const searchValue = value.toString().toLowerCase();
        
//         if (!vehicleValue.includes(searchValue)) {
//           return false;
//         }
//       }
//     }
//     return true;
//   });
// };

// // Função para marcar veículos como sincronizados
// export const markAsSynced = async (ids) => {
//   const db = await initDB();
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
//     const store = transaction.objectStore(VEHICLES_STORE);
    
//     let completed = 0;
//     let errors = [];
    
//     ids.forEach(id => {
//       const getRequest = store.get(id);
      
//       getRequest.onsuccess = (event) => {
//         const vehicle = event.target.result;
//         if (vehicle) {
//           vehicle.synced = true;
//           const updateRequest = store.put(vehicle);
          
//           updateRequest.onsuccess = () => {
//             completed++;
//             if (completed === ids.length) {
//               if (errors.length === 0) {
//                 resolve();
//               } else {
//                 reject(`Erros ao marcar como sincronizado: ${errors.join(', ')}`);
//               }
//             }
//           };
          
//           updateRequest.onerror = (event) => {
//             errors.push(`ID ${id}: ${event.target.error}`);
//             completed++;
//             if (completed === ids.length) {
//               reject(`Erros ao marcar como sincronizado: ${errors.join(', ')}`);
//             }
//           };
//         } else {
//           errors.push(`ID ${id}: veículo não encontrado`);
//           completed++;
//           if (completed === ids.length) {
//             if (errors.length === 0) {
//               resolve();
//             } else {
//               reject(`Erros ao marcar como sincronizado: ${errors.join(', ')}`);
//             }
//           }
//         }
//       };
      
//       getRequest.onerror = (event) => {
//         errors.push(`ID ${id}: ${event.target.error}`);
//         completed++;
//         if (completed === ids.length) {
//           reject(`Erros ao marcar como sincronizado: ${errors.join(', ')}`);
//         }
//       };
//     });
    
//     transaction.oncomplete = () => {
//       db.close();
//     };
//   });
// };

// // Função para obter veículos não sincronizados
// export const getUnsyncedVehicles = async () => {
//   const allVehicles = await getAllVehicles();
//   return allVehicles.filter(vehicle => !vehicle.synced);
// };

// // Função para gerar ID de dispositivo único para identificação
// const getDeviceId = () => {
//   // Verificar se já existe um ID de dispositivo armazenado
//   let deviceId = localStorage.getItem('deviceId');
  
//   if (!deviceId) {
//     // Gerar um novo ID de dispositivo usando timestamp + random
//     deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     localStorage.setItem('deviceId', deviceId);
//   }
  
//   return deviceId;
// };

// // Função para excluir um veículo
// export const deleteVehicle = async (id) => {
//   const db = await initDB();
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
//     const store = transaction.objectStore(VEHICLES_STORE);
//     const request = store.delete(id);
    
//     request.onsuccess = () => {
//       resolve(true);
//     };
    
//     request.onerror = (event) => {
//       reject(`Erro ao excluir veículo: ${event.target.error}`);
//     };
    
//     transaction.oncomplete = () => {
//       db.close();
//     };
//   });
// };

// // Pré-popular o banco de dados com alguns veículos de exemplo
// export const prePopulateDB = async () => {
//   const sampleVehicles = [
//     { vehicle: "Rally Car A", number: "101", team: "Equipe Alpha", pilot: "João Silva" },
//     { vehicle: "Eco Buggy", number: "202", team: "Equipe Beta", pilot: "Maria Santos" },
//     { vehicle: "Green Runner", number: "303", team: "Equipe Gamma", pilot: "Pedro Oliveira" },
//     { vehicle: "Electric Racer", number: "404", team: "Equipe Delta", pilot: "Ana Pereira" },
//     { vehicle: "Hybrid Speed", number: "505", team: "Equipe Alpha", pilot: "Carlos Mendes" }
//   ];
  
//   const existingVehicles = await getAllVehicles();
  
//   // Só pré-popular se não houver veículos cadastrados
//   if (existingVehicles.length === 0) {
//     for (const vehicle of sampleVehicles) {
//       await addVehicle(vehicle);
//     }
//     console.log("Banco de dados pré-populado com veículos de exemplo");
//   }
// };



// src/db/indexedDB.js

// Nome do banco de dados e versão
const DB_NAME = 'RallyCarbonoDB';
const DB_VERSION = 1;

// Nome das object stores
const VEHICLES_STORE = 'vehicles';
const SYNC_STATUS_STORE = 'syncStatus';

// Função para inicializar o banco de dados
export const initDB = () => {
  return new Promise((resolve, reject) => {
    // Abrir ou criar o banco de dados
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Executado quando a estrutura do banco de dados precisa ser criada/atualizada
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Criar object store para veículos se não existir
      if (!db.objectStoreNames.contains(VEHICLES_STORE)) {
        const vehiclesStore = db.createObjectStore(VEHICLES_STORE, { keyPath: 'id', autoIncrement: true });
        
        // Criar índices para busca
        vehiclesStore.createIndex('name', 'name', { unique: false });
        vehiclesStore.createIndex('number', 'number', { unique: false });
        vehiclesStore.createIndex('team', 'team', { unique: false });
        vehiclesStore.createIndex('pilot', 'pilot', { unique: false });
      }

      // Criar object store para status de sincronização
      if (!db.objectStoreNames.contains(SYNC_STATUS_STORE)) {
        const syncStatusStore = db.createObjectStore(SYNC_STATUS_STORE, { keyPath: 'id' });
        // Adicionar registro inicial
        syncStatusStore.add({ id: 1, lastSync: null, pendingChanges: [] });
      }
    };

    // Chamado quando o banco de dados é aberto com sucesso
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    // Chamado quando ocorre um erro ao abrir o banco de dados
    request.onerror = (event) => {
      reject(`Erro ao abrir banco de dados: ${event.target.error}`);
    };
  });
};

// Função para adicionar um veículo
export const addVehicle = async (vehicleData) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
    const store = transaction.objectStore(VEHICLES_STORE);
    
    // Adicionar UUID para identificação única entre dispositivos
    const vehicleWithId = {
      ...vehicleData,
      deviceId: getDeviceId(),
      updatedAt: new Date().toISOString(),
      synced: false
    };
    
    const request = store.add(vehicleWithId);
    
    request.onsuccess = (event) => {
      resolve({ ...vehicleWithId, id: event.target.result });
    };
    
    request.onerror = (event) => {
      reject(`Erro ao adicionar veículo: ${event.target.error}`);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Função para adicionar múltiplos veículos (útil para importação em massa)
export const addMultipleVehicles = async (vehiclesData) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
    const store = transaction.objectStore(VEHICLES_STORE);
    
    let completedCount = 0;
    let successCount = 0;
    const errors = [];
    
    // Para cada veículo nos dados
    vehiclesData.forEach((vehicleData, index) => {
      // Adicionar UUID para identificação única entre dispositivos
      const vehicleWithId = {
        ...vehicleData,
        deviceId: getDeviceId(),
        updatedAt: new Date().toISOString(),
        synced: false
      };
      
      const request = store.add(vehicleWithId);
      
      request.onsuccess = () => {
        successCount++;
        completedCount++;
        
        // Verificar se todos foram processados
        if (completedCount === vehiclesData.length) {
          resolve({
            total: vehiclesData.length,
            success: successCount,
            errors: errors
          });
        }
      };
      
      request.onerror = (event) => {
        errors.push({
          index: index,
          error: `Erro ao adicionar veículo: ${event.target.error}`
        });
        
        completedCount++;
        
        // Verificar se todos foram processados
        if (completedCount === vehiclesData.length) {
          resolve({
            total: vehiclesData.length,
            success: successCount,
            errors: errors
          });
        }
      };
    });
    
    transaction.oncomplete = () => {
      db.close();
    };
    
    // Se não houver veículos para adicionar
    if (vehiclesData.length === 0) {
      resolve({
        total: 0,
        success: 0,
        errors: []
      });
    }
  });
};

// Função para atualizar um veículo
export const updateVehicle = async (id, vehicleData) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
    const store = transaction.objectStore(VEHICLES_STORE);
    
    // Primeiro, buscar o veículo atual
    const getRequest = store.get(id);
    
    getRequest.onsuccess = (event) => {
      const existingVehicle = event.target.result;
      if (!existingVehicle) {
        reject(`Veículo com ID ${id} não encontrado`);
        return;
      }
      
      // Atualizar os dados
      const updatedVehicle = {
        ...existingVehicle,
        ...vehicleData,
        updatedAt: new Date().toISOString(),
        synced: false
      };
      
      const updateRequest = store.put(updatedVehicle);
      
      updateRequest.onsuccess = () => {
        resolve(updatedVehicle);
      };
      
      updateRequest.onerror = (event) => {
        reject(`Erro ao atualizar veículo: ${event.target.error}`);
      };
    };
    
    getRequest.onerror = (event) => {
      reject(`Erro ao buscar veículo: ${event.target.error}`);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Função para obter todos os veículos
export const getAllVehicles = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLES_STORE], 'readonly');
    const store = transaction.objectStore(VEHICLES_STORE);
    const request = store.getAll();
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject(`Erro ao buscar veículos: ${event.target.error}`);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Função para buscar um veículo pelo ID
export const getVehicleById = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLES_STORE], 'readonly');
    const store = transaction.objectStore(VEHICLES_STORE);
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject(`Erro ao buscar veículo: ${event.target.error}`);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Função para buscar veículos por critérios
export const searchVehicles = async (criteria) => {
  const allVehicles = await getAllVehicles();
  
  // Filtrar veículos de acordo com os critérios
  return allVehicles.filter(vehicle => {
    // Verificar correspondência em cada critério fornecido
    for (const [key, value] of Object.entries(criteria)) {
      if (value && vehicle[key]) {
        const vehicleValue = vehicle[key].toString().toLowerCase();
        const searchValue = value.toString().toLowerCase();
        
        if (!vehicleValue.includes(searchValue)) {
          return false;
        }
      }
    }
    return true;
  });
};

// Função para marcar veículos como sincronizados
export const markAsSynced = async (ids) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
    const store = transaction.objectStore(VEHICLES_STORE);
    
    let completed = 0;
    let errors = [];
    
    ids.forEach(id => {
      const getRequest = store.get(id);
      
      getRequest.onsuccess = (event) => {
        const vehicle = event.target.result;
        if (vehicle) {
          vehicle.synced = true;
          const updateRequest = store.put(vehicle);
          
          updateRequest.onsuccess = () => {
            completed++;
            if (completed === ids.length) {
              if (errors.length === 0) {
                resolve();
              } else {
                reject(`Erros ao marcar como sincronizado: ${errors.join(', ')}`);
              }
            }
          };
          
          updateRequest.onerror = (event) => {
            errors.push(`ID ${id}: ${event.target.error}`);
            completed++;
            if (completed === ids.length) {
              reject(`Erros ao marcar como sincronizado: ${errors.join(', ')}`);
            }
          };
        } else {
          errors.push(`ID ${id}: veículo não encontrado`);
          completed++;
          if (completed === ids.length) {
            if (errors.length === 0) {
              resolve();
            } else {
              reject(`Erros ao marcar como sincronizado: ${errors.join(', ')}`);
            }
          }
        }
      };
      
      getRequest.onerror = (event) => {
        errors.push(`ID ${id}: ${event.target.error}`);
        completed++;
        if (completed === ids.length) {
          reject(`Erros ao marcar como sincronizado: ${errors.join(', ')}`);
        }
      };
    });
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Função para obter veículos não sincronizados
export const getUnsyncedVehicles = async () => {
  const allVehicles = await getAllVehicles();
  return allVehicles.filter(vehicle => !vehicle.synced);
};

// Função para gerar ID de dispositivo único para identificação
const getDeviceId = () => {
  // Verificar se já existe um ID de dispositivo armazenado
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    // Gerar um novo ID de dispositivo usando timestamp + random
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
};

// Função para excluir um veículo
export const deleteVehicle = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
    const store = transaction.objectStore(VEHICLES_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve(true);
    };
    
    request.onerror = (event) => {
      reject(`Erro ao excluir veículo: ${event.target.error}`);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Função para limpar todos os veículos do banco de dados
export const clearAllVehicles = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLES_STORE], 'readwrite');
    const store = transaction.objectStore(VEHICLES_STORE);
    const request = store.clear();
    
    request.onsuccess = () => {
      resolve(true);
    };
    
    request.onerror = (event) => {
      reject(`Erro ao limpar veículos: ${event.target.error}`);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// popular o banco de dados
export const prePopulateDB = async () => {  
  
  await getAllVehicles();
  
  // Só pré-popular se não houver veículos cadastrados
  // if (existingVehicles.length === 0) {
  //   for (const vehicle of sampleVehicles) {
  //     await addVehicle(vehicle);
  //   }
  //   console.log("Banco de dados pré-populado com veículos de exemplo");
  // }
};