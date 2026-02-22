/**
 * Analytics Service - Fetch aggregated survey data for dashboard charts
 */

import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface AnalyticsSummary {
  total_responses: number;
  districts_covered: number;
  divisions_covered: number;
  mandals_covered: number;
  villages_covered: number;
  top_district: string | null;
  top_district_count: number;
}

export interface QuestionAnalytics {
  question_id: string;
  question_label: string;
  input_type: string;
  total_responses: number;
  labels: string[];
  values: number[];
  data: Record<string, number>;
}

export interface LocationBreakdown {
  level: string;
  labels: string[];
  values: number[];
}

export interface TimeSeriesData {
  period: string;
  labels: string[];
  values: number[];
}

export interface MultiQuestionAnalytics {
  [question_id: string]: {
    question_label: string;
    input_type: string;
    labels: string[];
    values: number[];
    data: Record<string, number>;
  };
}

class AnalyticsService {
  /**
   * Get overall summary statistics
   */
  async getSummary(): Promise<AnalyticsSummary> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/summary/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch summary: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      throw error;
    }
  }

  /**
   * Get analytics for a specific question
   */
  async getQuestionAnalytics(questionId: string): Promise<QuestionAnalytics> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/question/${questionId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch question analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching analytics for question ${questionId}:`, error);
      throw error;
    }
  }

  /**
   * Get location breakdown
   * @param level - 'district', 'division', or 'mandal'
   */
  async getLocationBreakdown(level: 'district' | 'division' | 'mandal' = 'district'): Promise<LocationBreakdown> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/location-breakdown/?level=${level}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch location breakdown: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching location breakdown:', error);
      throw error;
    }
  }

  /**
   * Get time series data
   * @param period - 'daily', 'weekly', or 'monthly'
   */
  async getTimeSeries(period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<TimeSeriesData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/time-series/?period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch time series: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching time series:', error);
      throw error;
    }
  }

  /**
   * Get analytics for multiple questions at once
   */
  async getMultiQuestionAnalytics(questionIds: string[]): Promise<MultiQuestionAnalytics> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/multi-question/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify({ question_ids: questionIds }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch multi-question analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching multi-question analytics:', error);
      throw error;
    }
  }

  /**
   * Get women employment status data for pie chart
   */
  async getWomenStatus(): Promise<Array<{ label: string; value: number }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/women-status/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch women status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching women status:', error);
      throw error;
    }
  }

  /**
   * Get top interests data for chart
   */
  async getTopInterests(): Promise<Array<{ label: string; value: number }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/top-interests/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch top interests: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching top interests:', error);
      throw error;
    }
  }

  /**
   * Get training areas time series data for stacked line chart
   */
  async getTrainingAreasTrends(): Promise<{ categories: string[]; series: Array<{ name: string; data: number[] }> }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/training-areas-trends/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch training areas trends: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching training areas trends:', error);
      throw error;
    }
  }

  /**
   * Get age group analytics data
   */
  async getAgeGroupAnalytics(): Promise<{ labels: string[]; values: number[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/age-group/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch age group analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching age group analytics:', error);
      throw error;
    }
  }

  /**
   * Get monthly registration trends data
   */
  async getMonthlyRegistrationTrends(): Promise<TimeSeriesData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/monthly-registration-trends/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch monthly registration trends: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching monthly registration trends:', error);
      throw error;
    }
  }

  /**
   * Get mandal performance analytics data for polar chart
   */
  async getMandalPerformance(): Promise<{ labels: string[]; values: number[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/mandal-performance/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch mandal performance: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching mandal performance:', error);
      throw error;
    }
  }

  /**
   * Get government schemes analytics data for chart
   */
  async getGovtSchemesAnalytics(): Promise<{ labels: string[]; values: number[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/govt-schemes/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch govt schemes analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching govt schemes analytics:', error);
      throw error;
    }
  }

  /**
   * Get government group membership analytics data for chart
   */
  async getGovtGroupMembershipAnalytics(): Promise<{ labels: string[]; values: number[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/govt-group-membership/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch govt group membership analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching govt group membership analytics:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
