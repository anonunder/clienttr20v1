export interface MeasurementField {
  field: string;
  label: string;
  type: 'number' | 'text';
  unit: string;
}

export interface MeasurementTemplate {
  id: number;
  title: string;
  selectedFields: MeasurementField[];
  createdAt: string;
}

export interface MeasurementImage {
  id: number;
  fileName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface MeasurementEntry {
  id: number;
  templateId: number;
  date: string;
  measurements: {
    [key: string]: number;
  };
  images: MeasurementImage[];
}

export interface MeasurementHistory {
  date: string;
  time: string;
  value: number;
  images: MeasurementImage[];
}

export interface Measurement {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  goal?: number;
  change?: number;
  history?: { date: string; value: number }[];
}

export interface SubmitMeasurementPayload {
  companyId: number;
  templateId: number;
  measurements: {
    [key: string]: number;
  };
  images?: {
    data: string;
    fileName: string;
    mimeType: string;
  }[];
}

export interface FieldProgressData {
  date: string;
  value: number;
}

export interface FieldProgress {
  fieldName: string;
  data: FieldProgressData[];
  count: number;
  latestValue: number;
  oldestValue: number;
  change: number;
}

