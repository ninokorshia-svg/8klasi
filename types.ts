export type Difficulty = 'easy' | 'medium' | 'hard';

export type EnergyTopic = 
  | 'ფორმები' 
  | 'წყაროები' 
  | 'განახლებადი' 
  | 'ეკოლოგია';

export type PerformanceLevel = 'გაფართოებული / შემოქმედებითი' | 'დამოუკიდებელი' | 'საჭიროებს მხარდაჭერას';

export interface RawQuestion {
  id: string;
  topic: EnergyTopic;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: {
    correctText: string;
    mistakeText: string;
    scienceHint: string;
  };
  illustrationType: 
    | 'kinetic_motion'
    | 'natural_light'
    | 'wind_turbine'
    | 'coal_energy'
    | 'battery_chemistry'
    | 'stretched_bow'
    | 'hydro_dam'
    | 'greenhouse_effect'
    | 'solar_panels'
    | 'fossil_fuels'
    | 'thermal_power'
    | 'energy_chain';
}

export interface ShuffledQuestion {
  id: string;
  topic: EnergyTopic;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  originalCorrectText: string;
  explanation: {
    correctText: string;
    mistakeText: string;
    scienceHint: string;
  };
  illustrationType: RawQuestion['illustrationType'];
}

export interface UserAnswerRecord {
  questionId: string;
  questionText: string;
  topic: EnergyTopic;
  difficulty: Difficulty;
  userSelectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  selectedText: string;
  correctText: string;
  explanation: string;
}

export interface StudentSubmission {
  id: string;
  studentNumber: string; // რიგითი ნომერი ჟურნალში (მაგ: №5)
  studentClass: string;  // კლასი (მაგ: VIII-ა)
  completedAt: string;
  score: number;
  totalPossible: number;
  correctCount: number;
  totalQuestions: number;
  performanceLevel: PerformanceLevel;
  answers: UserAnswerRecord[];
  teacherNotes: string;
}

export type GameStage = 'start' | 'playing' | 'summary' | 'teacher_dashboard';
