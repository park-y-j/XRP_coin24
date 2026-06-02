/**
 * Types and Interfaces for Coin Rise Predictor
 */

export interface MetricDetail {
  id: string; // e.g. "spot-cvd", "oi", "liquidation", etc.
  name: string; // 지표명, e.g. "SPOT CVD"
  value: string; // 최근 데이터 값, e.g. "매도 우위 (Upbit 중심 지속 매도)"
  interpretation: string; // 상승 유리성 해석, e.g. "현물 매도 압력 강함..."
  signal: "UPUP" | "UP" | "NEUTRAL" | "DOWN" | "DOWNDOWN"; // 기호화된 화살표 (↑↑, ↑, →, ↓, ↓↓)
  weight: number; // 별 개수 (1~5)
  maxScore: number; // 배점
  score: number; // 획득 점수
  category: "spot" | "oi" | "liquidation" | "onchain" | "volume" | "funding" | "btcd" | "futures" | "technical" | "stable";
}

export interface CoinAnalysis {
  symbol: string; // e.g. "XRP"
  name: string; // e.g. "리플"
  price: number; // 가격 (USD)
  change24h: number; // 24시간 변동률 (%)
  winRate: number; // 승률 (%)
  probability: number; // 상승 신뢰도 / 확률 (%)
  totalScore: number; // 100점 만점 점수
  feedback: string; // AI 한줄 요약평
  analyzedAt: string; // 분석 시간
  metrics: MetricDetail[];
}

export interface CompareResult {
  symbol: string;
  name: string;
  totalScore: number;
  winRate: number;
  probability: number;
  rating: "S" | "A" | "B" | "C" | "D"; // 진입 매수 등급
  badge: string; // 진입 매수 추천 수치 (적극 매수, 매수, 관망, 매도 등)
  color: string; // 테두리 또는 배경 색상
  scores: {
    spotCvd: number;
    oi: number;
    liquidation: number;
    onchain: number;
    volume: number;
    funding: number;
    btcd: number;
    rsi: number;
    macd: number;
    stable: number;
  };
}

export interface ValidationStatus {
  timeframe: "6h" | "12h" | "24h" | "72h";
  status: "SUCCESS" | "FAILURE" | "PENDING";
  actualChange: number | null;
  targetPrice: number | null;
}

export interface PredictionHistoryItem {
  id: string;
  time: string;
  symbol: string;
  name: string;
  totalScore: number;
  rating: "S" | "A" | "B" | "C" | "D";
  priceAtPredict: number;
  expectedDirection: "UP" | "DOWN";
  metricsSummary: string; // Brief of indicator states
  validations: {
    "6h": ValidationStatus;
    "12h": ValidationStatus;
    "24h": ValidationStatus;
    "72h": ValidationStatus;
  };
}

export interface AccuracyBrackets {
  above82: number; // e.g. 71
  between70_81: number; // e.g. 59
  between60_69: number; // e.g. 52
  overall: number; // e.g. 61
}

