export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getInitials = (firstName, lastName) => {
  return `${(firstName || '')[0]}${(lastName || '')[0]}`.toUpperCase();
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getEmployeeFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`.trim();
};

export const handleAxiosError = (error) => {
  if (error.response) {
    
    return error.response.data?.message || error.response.statusText;

  } else if (error.request) {

    return 'No response from server';

  } else {

    return error.message;
    
  }
};