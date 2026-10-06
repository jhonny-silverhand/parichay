export type PlatformType = 'web' | 'android' | 'ios';

export interface NetworkStatus {
  connected: boolean;
  connectionType: 'wifi' | 'cellular' | 'none' | 'unknown';
}

export interface DeviceInfo {
  model: string;
  platform: PlatformType;
  operatingSystem: 'android' | 'ios' | 'windows' | 'mac' | 'linux' | 'unknown';
  osVersion: string;
  manufacturer: string;
  isVirtual: boolean;
  appVersion: string;
  appBuild: string;
}

export interface PermissionStatus {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}
