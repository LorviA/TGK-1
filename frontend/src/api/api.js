const BASE_URL = 'http://localhost:8000';  // адрес бэка

//получение всех пользователей
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/`, {
      headers: {
        'accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Ошибка при загрузке пользователей');
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    return [];
  }
};

export const getUserData = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Если используется авторизация
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Ошибка сервера: ${response.status}`);
    }

    const userData = await response.json();

    // Проверяем, что получили данные пользователя
    if (!userData || !userData.id) {
      throw new Error('Пользователь не найден');
    }

    return userData;

  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    throw error;
  }
};


// Поиск ID пользователя по логину
export const findUserByLogin = async (login) => {
  const response = await fetch(`${BASE_URL}/users/by-username/${login}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Пользователь не найден');
    }
    throw new Error('Ошибка при получении пользователя');
  }

  const data = await response.json();
  return data.id; // Возвращаем только ID
};

// Обновление данных пользователя
export const updateUser = async (userId, updates) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error('Ошибка обновления пользователя');
  return await response.json();
};

// Проверка соответствия введенного при входе пароля с паролем из БД
export const verifyUserPassword = async (user_id, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${user_id}`);
    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

    const user = await response.json();
    return user.password === password;

  } catch (error) {
    console.error('Ошибка проверки пароля:', error);
    throw error;
  }
};


// Проверка отсутствия логина в БД
export const checkLoginExists = async (login) => {
  try {
    const response = await fetch(`${BASE_URL}/users/`);
    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

    const users = await response.json();
    return users.some(user => user.user_name === login);

  } catch (error) {
    console.error('Ошибка проверки логина:', error);
    throw error;
  }
};


// Регистрация нового пользователя
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Ошибка регистрации: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw error;
  }
};

//получение всех ЗНО
export const getAllZno = async () => {
  try {
    const response = await fetch(`${BASE_URL}/zno/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Ошибка при получении ZNO: ${response.status}`);
    }

    const znoData = await response.json();

    // Проверяем, что получили массив
    if (!Array.isArray(znoData)) {
      throw new Error('Некорректный формат данных ZNO');
    }

    return znoData;

  } catch (error) {
    console.error('Ошибка в getAllZno:', error);
    throw error;
  }
};

//создание ЗНО
export const sendZno = async (znoData) => {
  try {
    const response = await fetch(`${BASE_URL}/zno/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(znoData)
    });

    if (!response.ok) {
      throw new Error(`Ошибка при отправке: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка отправки ЗНО:', error);
    throw error;
  }
};

// обновление ЗНО
export const patchZno = async (zno_id, data) => {
  try {
    const response = await fetch(`${BASE_URL}/zno/${zno_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Ошибка обновления ЗНО');
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка в patchZno:", error);
    throw error;
  }
};

// получение данных ЗНО по ID
export const getZnoById = async (znoId) => {
  try {
    const response = await fetch(`${BASE_URL}/zno/${znoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении данных ЗНО');
    }

    const data = await response.json();
    return data; // Возвращаем полученные данные ЗНО
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};

//Удаление ЗНО
export const deleteZno = async (id) => {
  const response = await fetch(`${BASE_URL}/zno/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Ошибка при удалении ЗНО');
  }

  // Для статуса 204 просто возвращаем true
  if (response.status === 204) {
    return true;
  }

  // Если сервер вернет тело ответа
  try {
    return await response.json();
  } catch {
    return true;
  }
};

//сортировка зно по дате создания
export const getFilteredByCreateDateZno = async (startDate, endDate) => {
  try {
    const response = await fetch(`${BASE_URL}/zno/filter/?create_data_from=${startDate}&create_data_to=${endDate}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Ошибка в getZnoSortByData:', error);
    throw error;
  }
};



//Загрузка данных из справочника Статей смет
export const getDirStSmet = async () => {
  const response = await fetch(`${BASE_URL}/DirectoriesStSmet/`);
  if (!response.ok) throw new Error('Ошибка загрузки данных');
  const data = await response.json();
  return data.sort((a, b) => a.st.localeCompare(b.st, undefined, { numeric: true }));
};

// Создание новой статьи
export const createStSmetItem = async (data) => {
  const response = await fetch(`${BASE_URL}/DirectoriesStSmet/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Ошибка создания записи');
  return await response.json();
};

export const updateStSmetItem = async (id, data) => {
  const response = await fetch(`${BASE_URL}/DirectoriesStSmet/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Ошибка обновления записи');
  return await response.json();
};

export const deleteStSmetItem = async (id) => {
  const response = await fetch(`${BASE_URL}/DirectoriesStSmet/${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Ошибка удаления записи');
  return id;
};

export const getStSmetDirById = async (directoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/DirectoriesStSmet/${directoryId}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Не удалось загрузить статью сметы');
    }
    const data = await response.json();
    return data;  // возвращаем все данные, полученные от API
  } catch (error) {
    console.error('Ошибка при получении статьи сметы:', error);
    return null;
  }
};

//Загрузка данных из справочника Конфидециальной информации
export const getDirConfOfInf = async () => {
  const response = await fetch(`${BASE_URL}/DirectoriesConfidentialityOfInformation/`);
  if (!response.ok) throw new Error('Ошибка загрузки типов конфиденциальности');
  return await response.json();
};

export const getConfInfDirById = async (directoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/DirectoriesConfidentialityOfInformation/${directoryId}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Не удалось загрузить статью конфиденциальности');
    }
    const data = await response.json();
    return data.name || '-';  // возвращаем имя статьи
  } catch (error) {
    console.error('Ошибка при получении статьи конфиденциальности:', error);
    return '-';
  }
};

// создание новой записи в справочнике Конфиденциальная информация
export const createConfItem = async (data) => {
  const response = await fetch(`${BASE_URL}/DirectoriesConfidentialityOfInformation/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data) // передаем весь объект данных
  });
  if (!response.ok) throw new Error('Ошибка создания записи');
  return await response.json();
};

// обновление существующей записи в справочнике Конфиденциальная информация
export const updateConfItem = async (id, data) => {
  const response = await fetch(`${BASE_URL}/DirectoriesConfidentialityOfInformation/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data) // передаем весь объект данных
  });
  if (!response.ok) throw new Error('Ошибка обновления записи');
  return await response.json();
};


//удаление записи  в справочнике Конфидециальная информация
export const deleteConfItem = async (id) => {
  const response = await fetch(`${BASE_URL}/DirectoriesConfidentialityOfInformation/${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Ошибка удаления записи');
  return id; // Возвращаем ID удаленной записи
};

//Добавления оплаты в ЗНО
export const uploadZnoPayment = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BASE_URL}/zno/upload-zno-payment/`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error uploading ZNO payment:', error);
    throw error;
  }
};

//обновление данных СМСП в ЗНО
export const uploadSmsps = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BASE_URL}/zno/upload-smsps/`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error uploading SMSPS:', error);
    throw error;
  }
};

// Получение всех логов
export const getAllLogs = async () => {
  const response = await fetch(`${BASE_URL}/loggers/`);
  if (!response.ok) throw new Error('Ошибка загрузки логов');
  return await response.json();
};

// Установка даты архивирования юзеров
export const setUsersExpiration = async (data) => {
  const response = await fetch(`${BASE_URL}/users/users/set-expiration/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

// Установка даты архивирования Конф Инф справочника
export const setDirectoriesConfidentialityExpiration = async (data) => {
  const response = await fetch(`${BASE_URL}/DirectoriesConfidentialityOfInformation/set-expiration/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

// Установка даты архивирования Ст Смет справочника
export const setDirectoriesStSmetExpiration = async (data) => {
  const response = await fetch(`${BASE_URL}/DirectoriesStSmet/set-expiration/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

//архивация юзеров
export const archiveUsers = async () => {
  const response = await fetch(
    `${BASE_URL}/users/archive-expired/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

//архивация статей сметы
export const archiveStSmet = async () => {
  const response = await fetch(
    `${BASE_URL}/DirectoriesStSmet/archive-expired/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// архивация конф инф
export const archiveConfidentialInfo = async () => {
  const response = await fetch(
    `${BASE_URL}/DirectoriesConfidentialityOfInformation/archive-expired/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Получение архивных записей справочника Статей смет
export const getArchivedStSmet = async () => {
  try {
    const response = await fetch(`${BASE_URL}/DirectoriesStSmet/archived/`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Ошибка при загрузке архивных статей смет');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Ошибка получения архивных статей смет:', error);
    throw error;
  }
};

// Получение архивных записей справочника Конфиденциальной информации
export const getArchivedConfInfo = async () => {
  try {
    const response = await fetch(`${BASE_URL}/DirectoriesConfidentialityOfInformation/archived/`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Ошибка при загрузке архивных записей конфиденциальной информации');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Ошибка получения архивных записей конфиденциальной информации:', error);
    throw error;
  }
};
