import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T = any> {
  statuscode: number;
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const data = await response.json();
        errorMessage = data.message || errorMessage;
      } catch (parseError) {
        // If we can't parse JSON, use the default error message
      }
      toast({
        title: "API Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
    return await response.json();
  }

  // User Management
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/users/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Company Management
  async getCompanyDetails() {
    const response = await fetch(`${API_BASE_URL}/company/details`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateCompanySettings(settings: any) {
    const response = await fetch(`${API_BASE_URL}/company/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ settings }),
    });
    return this.handleResponse(response);
  }

  async getCompanyEmployees(params?: { page?: number; limit?: number; role?: string; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/company/employees?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // User Management (Admin)
  async createUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/user-management/create`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async updateUserRole(userId: string, roleData: any) {
    const response = await fetch(`${API_BASE_URL}/user-management/${userId}/role`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(roleData),
    });
    return this.handleResponse(response);
  }

  async deactivateUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/user-management/${userId}/deactivate`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getUserDetails(userId: string) {
    const response = await fetch(`${API_BASE_URL}/user-management/${userId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getTeamMembers() {
    const response = await fetch(`${API_BASE_URL}/user-management/team/members`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Expense Management
  async createExpense(expenseData: FormData) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/expenses/create`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: expenseData,
    });
    return this.handleResponse(response);
  }

  async submitExpenseForApproval(expenseId: string) {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}/submit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyExpenses(params?: { page?: number; limit?: number; status?: string; category?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);

    const response = await fetch(`${API_BASE_URL}/expenses/my-expenses?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getExpensesForApproval(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/expenses/for-approval?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAllExpenses(params?: { page?: number; limit?: number; status?: string; category?: string; userId?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.userId) queryParams.append('userId', params.userId);

    const response = await fetch(`${API_BASE_URL}/expenses/all?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getExpenseDetails(expenseId: string) {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async processReceiptOCR(file: File) {
    const formData = new FormData();
    formData.append('receipt', file);

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/expenses/ocr-scan`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  // Approval Workflow
  async createApprovalRule(ruleData: any) {
    const response = await fetch(`${API_BASE_URL}/approval/rules`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ruleData),
    });
    return this.handleResponse(response);
  }

  async getApprovalRules() {
    const response = await fetch(`${API_BASE_URL}/approval/rules`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateApprovalRule(ruleId: string, ruleData: any) {
    const response = await fetch(`${API_BASE_URL}/approval/rules/${ruleId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ruleData),
    });
    return this.handleResponse(response);
  }

  async deleteApprovalRule(ruleId: string) {
    const response = await fetch(`${API_BASE_URL}/approval/rules/${ruleId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPendingApprovals() {
    const response = await fetch(`${API_BASE_URL}/approval/pending`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async approveExpense(requestId: string, comments?: string) {
    const response = await fetch(`${API_BASE_URL}/approval/${requestId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ comments }),
    });
    return this.handleResponse(response);
  }

  async rejectExpense(requestId: string, reason: string) {
    const response = await fetch(`${API_BASE_URL}/approval/${requestId}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    return this.handleResponse(response);
  }

  async adminOverrideApproval(requestId: string, action: 'APPROVE' | 'REJECT', comments: string) {
    const response = await fetch(`${API_BASE_URL}/expenses/approval/${requestId}/override`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ action, comments }),
    });
    return this.handleResponse(response);
  }

  async escalateApproval(requestId: string, targetApproverId: string, reason: string) {
    const response = await fetch(`${API_BASE_URL}/expenses/approval/${requestId}/escalate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ targetApproverId, reason }),
    });
    return this.handleResponse(response);
  }

  // Currency Conversion
  async getCurrencyRates(baseCurrency: string) {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    if (!response.ok) {
      throw new Error('Failed to fetch currency rates');
    }
    return response.json();
  }

  async getCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;
