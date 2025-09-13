export const initializeLocalStorage = () => {
  if (!localStorage.getItem('farmers')) {
    const farmers = [
      {
        id: 1,
        firstName: 'Rajesh',
        lastName: 'Kumar',
        userName: 'rajesh123',
        password: 'password123',
        mobile: '9876543210',
        country: 'India',
        fruits: [
          { id: 1, category: 'Apple', price: 80, quantity: 100 },
          { id: 2, category: 'Grapes', price: 60, quantity: 50 }
        ]
      },
      // Add 6 more farmers with similar structure
    ];
    localStorage.setItem('farmers', JSON.stringify(farmers));
  }

  if (!localStorage.getItem('admins')) {
    const admins = [
      {
        id: 1,
        userName: 'admin1',
        password: 'admin123'
      },
      {
        id: 2,
        userName: 'admin2',
        password: 'admin456'
      }
    ];
    localStorage.setItem('admins', JSON.stringify(admins));
  }

  if (!localStorage.getItem('requests')) {
    localStorage.setItem('requests', JSON.stringify([]));
  }
};

export const getFarmers = () => JSON.parse(localStorage.getItem('farmers') || '[]');
export const getAdmins = () => JSON.parse(localStorage.getItem('admins') || '[]');
export const getRequests = () => JSON.parse(localStorage.getItem('requests') || '[]');

export const saveFarmers = (farmers) => localStorage.setItem('farmers', JSON.stringify(farmers));
export const saveAdmins = (admins) => localStorage.setItem('admins', JSON.stringify(admins));
export const saveRequests = (requests) => localStorage.setItem('requests', JSON.stringify(requests));