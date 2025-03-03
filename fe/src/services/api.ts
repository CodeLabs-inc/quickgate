const API_URL = process.env.NEXT_PUBLIC_API_URL


//Token
export const setToken = (token: string) => {
  localStorage.setItem(String(process.env.NEXT_PUBLIC_PLATFORM_TOKEN_NAME), token);
}
export const getToken = () => {
  return localStorage.getItem(String(process.env.NEXT_PUBLIC_PLATFORM_TOKEN_NAME));
}

//Account
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return await response.json();
};
export const register = async (name: string, surname: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/account/register`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, email, password }),
    });
    
    return await response.json();
}
export const sendVerificationEmail = async (email: string) => {
  const response = await fetch(`${API_URL}/account/verify/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return await response.json();
}
export const verifyEmail = async (email: string, token: string) => {
  const response = await fetch(`${API_URL}/account/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, token }),
  });

  return await response.json();
}
export const logout = () => {
  localStorage.removeItem(String(process.env.NEXT_PUBLIC_PLATFORM_TOKEN_NAME));
  location.href = '/auth/login';
}
export const authenticate = async () => {
  const token = getToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/account/authenticate`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
}
export const getAllProfiles = async (page: number, limit:number, search: string, filter?: string) => {
  const response = await fetch(`${API_URL}/account/profiles/all?page=${page}&limit=${limit}&search=${search}&filter=${filter}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}
export const getAllOperators = async () => {
  const response = await fetch(`${API_URL}/account/operators/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}
export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/account/users/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}
export const createManualProfile = async (name: string, surname: string, email: string, type: string) => {
  const response = await fetch(`${API_URL}/account/admin/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, surname, email, type }),
  });

  return await response.json();
}
export const updateProfile = async (name: string, surname: string, email: string, type: string, userId: string) => {
  const response = await fetch(`${API_URL}/account/admin/update/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, surname, email, type }),
  });

  return await response.json();
}


//Settings
export const getSettingsProfile = async () => {
  const response = await fetch(`${API_URL}/account/settings/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const updateSettingsProfilePicture = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/account/settings/profile/picture`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
    body: formData,
  })

  return await response.json()
}
export const updateSettingsProfileName = async (name: string, surname: string, birthdate: string, address: string, phone: string ) => {
  const response = await fetch(`${API_URL}/account/settings/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, surname, birthdate, address, phone }),
  })

  return await response.json()
}
export const getSettingsAccess = async () => {
  const response = await fetch(`${API_URL}/account/settings/access`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const updateSettingsAccessEmail = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/account/settings/access/email`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ email, password }),
  })

  return await response.json()
}
export const updateSettingsAccessPassword = async (password: string, newPassword: string) => {
  const response = await fetch(`${API_URL}/account/settings/access/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ password, newPassword }),
  })

  return await response.json()
}
export const addPaymentMethod = async (cardNumber: string, cardHolder: string, expirationDate: string, cvv: string) => {
  //Filter and trim the cardNumber
  cardNumber = cardNumber.replace(/\s/g, '')


  const response = await fetch(`${API_URL}/payments/methods/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ cardNumber, cardHolder, expirationDate, cvv }),
  })

  return await response.json()
}
export const removePaymentMethod = async (id: string) => {
  const response = await fetch(`${API_URL}/payments/methods/remove/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const getCurrentPaymentMethod = async () => {
  const response = await fetch(`${API_URL}/payments/methods/current`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const getAllPaymentMethods = async () => {
  const response = await fetch(`${API_URL}/payments/methods/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const updatePaymentMethodEmail = async (paymentMethodId: string,email: string) => {
  const response = await fetch(`${API_URL}/payments/methods/update/${paymentMethodId}/email`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ paymentMethodId, email }),
  })

  return await response.json()
}
export const updatePaymentMethodDefault = async (paymentMethodId: string) => {
  const response = await fetch(`${API_URL}/payments/methods/update/${paymentMethodId}/default`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ paymentMethodId }),
  })

  return await response.json()
}
export const getSettingsGate = async () => {
  const response = await fetch(`${API_URL}/gate/settings/gate/get`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const updateSettingsGateMap = async (lat: string, lng: string) => {
  const response = await fetch(`${API_URL}/gate/settings/gate/map`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ lat, lng }),
  })

  return await response.json()
}
export const updateSettingsGateBooleans = async (isActive: boolean, isPrivate: boolean) => {
  const response = await fetch(`${API_URL}/gate/settings/gate/booleans`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ isActive, isPrivate }),
  })

  return await response.json()
}
export const updateSettingsGateInformations = async (name: string, city: string, street: string, capacity: number, daysOpen: any, openTime: string, closeTime: string) => {
  const response = await fetch(`${API_URL}/gate/settings/gate/informations`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, city, street, capacity, daysOpen, openTime, closeTime }),
  })

  return await response.json()
}
export const updateSettingsGateRates = async (daily: number, hourly: number) => {
  const response = await fetch(`${API_URL}/gate/settings/gate/rates`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ daily, hourly }),
  })

  return await response.json()
}
export const updateSettingsAmenitiesBooleans = async (isEV: boolean, isHandicapped: boolean) => {
  const response = await fetch(`${API_URL}/gate/settings/gate/booleans`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ isEV, isHandicapped }),
  })

  return await response.json()
}
export const updateSettingsGateBilling = async (payment_address: string, currency: string) => {
  const response = await fetch(`${API_URL}/gate/settings/gate/billing`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ payment_address, currency }),
  })

  return await response.json()
}




/* Gaters (operators) */
export const createGater = async (name: string, city: string, street: string) => {
  const response = await fetch(`${API_URL}/gate/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, city, street }),
  });

  return await response.json();
}
export const getAllGates = async (page: number, limit:number, search:string ,filter?: string) => {
  const response = await fetch(`${API_URL}/gate?page=${page}&limit=${limit}&filter=${filter}&search=${search}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}
export const getAllGatesSelect = async () => {
  const response = await fetch(`${API_URL}/gate/inputselect`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}
export const getGate = async (id: string) => {
  const response = await fetch(`${API_URL}/gate/get/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}
export const getGateDashboard = async () => {
  const response = await fetch(`${API_URL}/gate/dashboard/get`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}
export const getTransits = async (page: number, limit:number, search:string ,filter?: string) => {
  const response = await fetch(`${API_URL}/gate/transit?page=${page}&limit=${limit}&filter=${filter}&search=${search}`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}
export const addOperatorToGate = async (accountId: string, gateId: string) => {
  const response = await fetch(`${API_URL}/gate/add/operator`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ accountId, gateId }),
  });

  return await response.json();
}
export const DeleteOperatorFromGate = async (accountId: string, gateId: string) => {
  const response = await fetch(`${API_URL}/gate/delete/operator`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ accountId, gateId }),
  });

  return await response.json();
}
export const createGateSubscription = async (licensePlate: string, durationInDays: number) => {
  const response = await fetch(`${API_URL}/gate/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({licensePlate, duration:durationInDays }),
  });

  return await response.json();
}
export const getAllGateSubscriptions = async (page: number, limit:number, search:string ,filter?: string) => {
  const response = await fetch(`${API_URL}/gate/subscriptions?page=${page}&limit=${limit}&filter=${filter}&search=${search}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}
export const getGateSubscription = async (id: string) => {
  const response = await fetch(`${API_URL}/gate/subscriptions/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}

/* TICKETS */
export const getCurrentTicketGateInformation = async (licensePlate: string) => {
  const response = await fetch(`${API_URL}/ticket/informations/${licensePlate}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const manuallyValidateGateTicket = async (licensePlate: string) => {
  const response = await fetch(`${API_URL}/ticket/manual-validation/${licensePlate}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const getLast7DaysTickets = async () => {
  const response = await fetch(`${API_URL}/ticket/statistics/last-seven-days`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const getWeeklyDistribution = async () => {
  const response = await fetch(`${API_URL}/ticket/statistics/week-days`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return await response.json()
}
export const calculateTicketValue = async (plate: string) => {
  const response = await fetch(`${API_URL}/ticket/pay/calculate/${plate}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    }
  )

  return await response.json()
}

export const enterTicket = async (licensePlate: string, gateId: string) => {
  const response = await fetch(`${API_URL}/ticket/enter/${gateId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ plate: licensePlate }),
  })

  return await response.json()
}
export const exitTicket = async (licensePlate: string, gateId: string) => {
  const response = await fetch(`${API_URL}/ticket/exit/${gateId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ plate: licensePlate }),
  })

  return await response.json()
}


/* Vehicles */
export const getAllVehicles = async (page: number, limit:number, search:string ,filter?: string) => {
  const response = await fetch(`${API_URL}/vehicles?page=${page}&limit=${limit}&filter=${filter}&search=${search}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return await response.json();
}


/* READER BACKOFFICE */
export const readPlate = async (files: File[]) => {
  const formData = new FormData()

  formData.append('upload', files[0])
  formData.append('regions', 'do')

  const response = await fetch(`https://api.platerecognizer.com/v1/plate-reader/`, {
    method: 'POST',
    headers: {
      'Authorization': `Token c63e0884b683b1e1731fc473e7030ed75a745c74`,
    },
    body: formData,
  })

  return await response.json()
}


/* Devices */

export const getDevices = async () => {
  const response = await fetch(`${API_URL}/device/get/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  return {
    data: await response.json(),
    status: response.status
  };
}