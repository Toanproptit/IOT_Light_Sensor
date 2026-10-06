import { apiClient } from './apiClient'

export const iotApi = {
  getDashboard: () => apiClient.get('/dashboard/summary'),
  getDevices: () => apiClient.get('/devices'),
  controlDevice: (id, isOn, brightness) => apiClient.post(`/devices/${id}/control`, { isOn, brightness }),
  controlAll: (isOn) => apiClient.post('/devices/control-all', { isOn }),
  getSensorHistory: (params = {}) => apiClient.get('/sensors/history', { page: 1, limit: 10, direction: 'desc', ...params }),
  getActions: (params = {}) => apiClient.get('/actions', { page: 1, limit: 10, direction: 'desc', ...params }),
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (profile) => apiClient.patch('/profile', profile),
}
