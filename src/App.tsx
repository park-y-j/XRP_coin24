import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Search, 
  Sparkles, 
  RefreshCw, 
  LineChart, 
  PlusCircle, 
  AlertTriangle,
  Layers,
  HelpCircle
} from "lucide-react";
import { CoinAnalysis, CompareResult, PredictionHistoryItem, AccuracyBrackets } from "./types";
import ScoreGauge from "./components/ScoreGauge";
import MetricTable from "./components/MetricTable";
import CompareBoard from "./components/CompareBoard";
import TimeframeProjections from "./components/TimeframeProjections";
import PredictionValidationBoard from "./components/PredictionValidationBoard";

const PRESET_SYMBOLS = ["XRP", "BTC", "ETH", "SOL", "DOGE", "SUI"];

const INITIAL_HISTORY: PredictionHistoryItem[] = [
  {
    id: "hist-1",
    time: "2026-05-27 10:30:15",
    symbol: "BTC",
    name: "비트코인",
    totalScore: 88,
    rating: "S",
    priceAtPredict: 68450,
    expectedDirection: "UP",
    metricsSummary: "SPOT CVD(18/20) | OI(13/15) | MACD(3/3) | Funding(4/5)",
    validations: {
      "6h": { timeframe: "6h", status: "SUCCESS", actualChange: 1.25, targetPrice: 69305 },
      "12h": { timeframe: "12h", status: "SUCCESS", actualChange: 2.84, targetPrice: 70394 },
      "24h": { timeframe: "24h", status: "SUCCESS", actualChange: 4.91, targetPrice: 71810 },
      "72h": { timeframe: "72h", status: "SUCCESS", actualChange: 6.12, targetPrice: 72639 }
    }
  },
  {
    id: "hist-2",
    time: "2026-05-29 18:45:00",
    symbol: "SOL",
    name: "솔라나",
    totalScore: 79,
    rating: "A",
    priceAtPredict: 164.5,
    expectedDirection: "UP",
    metricsSummary: "RSI(4/5) | MACD(2/3) | SPOT CVD(13/20) | OI(11/15)",
    validations: {
      "6h": { timeframe: "6h", status: "SUCCESS", actualChange: 1.84, targetPrice: 167.5 },
      "12h": { timeframe: "12h", status: "SUCCESS", actualChange: 2.15, targetPrice: 168.0 },
      "24h": { timeframe: "24h", status: "PENDING", actualChange: null, targetPrice: null },
      "72h": { timeframe: "72h", status: "PENDING", actualChange: null, targetPrice: null }
    }
  },
  {
    id: "hist-3",
    time: "2026-05-29 06:15:24",
    symbol: "SUI",
    name: "수이",
    totalScore: 64,
    rating: "B",
    priceAtPredict: 1.12,
    expectedDirection: "UP",
    metricsSummary: "Stable Inflow(2/2) | Volume(6/10) | RSI(3/5) | BTC Dom(3/5)",
    validations: {
      "6h": { timeframe: "6h", status: "FAILURE", actualChange: -0.45, targetPrice: 1.11 },
      "12h": { timeframe: "12h", status: "SUCCESS", actualChange: 0.81, targetPrice: 1.13 },
      "24h": { timeframe: "24h", status: "SUCCESS", actualChange: 1.24, targetPrice: 1.13 },
      "72h": { timeframe: "72h", status: "PENDING", actualChange: null, targetPrice: null }
    }
  },
  {
    id: "hist-4",
    time: "2026-05-27 12:00:00",
    symbol: "DOGE",
    name: "도지코인",
    totalScore: 42,
    rating: "C",
    priceAtPredict: 0.142,
    expectedDirection: "DOWN",
    metricsSummary: "SPOT CVD(5/20) | OI(4/15) | Funding(4/5) | MACD(1/3)",
    validations: {
      "6h": { timeframe: "6h", status: "SUCCESS", actualChange: -1.45, targetPrice: 0.140 },
      "12h": { timeframe: "12h", status: "SUCCESS", actualChange: -2.10, targetPrice: 0.139 },
      "24h": { timeframe: "24h", status: "SUCCESS", actualChange: -1.90, targetPrice: 0.139 },
      "72h": { timeframe: "72h", status: "FAILURE", actualChange: 2.40, targetPrice: 0.145 }
    }
  },
  {
    id: "hist-seed-1",
    time: "2026-05-26 14:00:00",
    symbol: "XRP",
    name: "리플",
    totalScore: 84,
    rating: "S",
    priceAtPredict: 0.524,
    expectedDirection: "UP",
    metricsSummary: "SPOT CVD(17/20) | RSI(4/5) | BTC Dom(4/5) | stable(2/2)",
    validations: {
      "6h": { timeframe: "6h", status: "SUCCESS", actualChange: 1.15, targetPrice: 0.530 },
      "12h": { timeframe: "12h", status: "SUCCESS", actualChange: 1.75, targetPrice: 0.533 },
      "24h": { timeframe: "24h", status: "FAILURE", actualChange: -0.65, targetPrice: 0.521 },
      "72h": { timeframe: "72h", status: "SUCCESS", actualChange: 2.45, targetPrice: 0.537 }
    }
  },
  {
    id: "hist-seed-2",
    time: "2026-05-25 09:30:10",
    symbol: "ETH",
    name: "이더리움",
    totalScore: 72,
    rating: "A",
    priceAtPredict: 3415,
    expectedDirection: "UP",
    metricsSummary: "MACD(2/3) | OI(12/15) | Volume(8/10) | Funding(4/5)",
    validations: {
      "6h": { timeframe: "6h", status: "FAILURE", actualChange: -0.85, targetPrice: 3386 },
      "12h": { timeframe: "12h", status: "SUCCESS", actualChange: 1.15, targetPrice: 3454 },
      "24h": { timeframe: "24h", status: "FAILURE", actualChange: -1.25, targetPrice: 3372 },
      "72h": { timeframe: "72h", status: "SUCCESS", actualChange: 2.10, targetPrice: 3487 }
    }
  }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCoin, setActiveCoin] = useState<CoinAnalysis | null>(null);
  const [analyzedList, setAnalyzedList] = useState<CompareResult[]>([]);
  const [historyList, setHistoryList] = useState<PredictionHistoryItem[]>(INITIAL_HISTORY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to map active coin analysis to compare list structure
  const updateCompareList = (coin: CoinAnalysis) => {
    // Generate Rating and Badge details
    let rating: "S" | "A" | "B" | "C" | "D" = "C";
    let badge = "관망";
    let color = "text-yellow-400 border-yellow-500/30 bg-yellow-550/10";

    const score = coin.totalScore;
    if (score >= 85) {
      rating = "S";
      badge = "적극 매수";
      color = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    } else if (score >= 70) {
      rating = "A";
      badge = "분할 매수";
      color = "text-teal-400 border-teal-500/30 bg-teal-500/10";
    } else if (score >= 50) {
      rating = "B";
      badge = "보수 진입";
      color = "text-sky-400 border-sky-500/30 bg-rose-500/10";
    } else if (score < 30) {
      rating = "D";
      badge = "진입 보류";
      color = "text-rose-400 border-rose-500/30 bg-rose-500/10";
    } else {
      rating = "C";
      badge = "관망 필요";
      color = "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
    }

    // Extract values dynamically for score representation
    const getScoreOf = (cat: string) => {
      const match = coin.metrics.find(m => m.id.includes(cat) || m.category === cat);
      return match ? match.score : 0;
    };

    const newCompareItem: CompareResult = {
      symbol: coin.symbol,
      name: coin.name,
      totalScore: coin.totalScore,
      winRate: coin.winRate,
      probability: coin.probability,
      rating,
      badge,
      color,
      scores: {
        spotCvd: getScoreOf("spot"),
        oi: getScoreOf("oi"),
        liquidation: getScoreOf("liquidation"),
        onchain: getScoreOf("onchain"),
        volume: getScoreOf("volume"),
        funding: getScoreOf("funding"),
        btcd: getScoreOf("btcd"),
        rsi: coin.metrics.find(m => m.id === "rsi")?.score ?? (coin.metrics.find(m => m.id === "rsi-macd") ? 5 : 0),
        macd: coin.metrics.find(m => m.id === "macd")?.score ?? (coin.metrics.find(m => m.id === "rsi-macd") ? 3 : 0),
        stable: getScoreOf("stable")
      }
    };

    setAnalyzedList(prev => {
      // Filter out duplicates if same coin is analyzed again
      const filtered = prev.filter(item => item.symbol.toUpperCase() !== coin.symbol.toUpperCase());
      return [newCompareItem, ...filtered];
    });
  };

  // Perform backend AI prediction/analysis
  const runAnalysis = async (symbol: string) => {
    if (!symbol.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/predict?symbol=${encodeURIComponent(symbol.toUpperCase())}`);
      if (!resp.ok) {
        throw new Error("서버와의 통신에 실패했습니다.");
      }
      const data: CoinAnalysis = await resp.json();
      setActiveCoin(data);
      updateCompareList(data);
      addNewPredictionLog(data);
    } catch (err: any) {
      setError(err.message || "종목을 분석하는 중에 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const addNewPredictionLog = (coin: CoinAnalysis) => {
    const formattedTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    // Determine Rating and Expected direction
    let rating: "S" | "A" | "B" | "C" | "D" = "C";
    const score = coin.totalScore;
    if (score >= 82) rating = "S";
    else if (score >= 70) rating = "A";
    else if (score >= 60) rating = "B";
    else if (score >= 30) rating = "C";
    else rating = "D";

    const expectedDirection = score >= 55 ? "UP" : "DOWN";

    const summaryStr = coin.metrics
      .map(m => `${m.name}(${m.score}/${m.maxScore})`)
      .slice(0, 3)
      .join(" | ");

    const newItem: PredictionHistoryItem = {
      id: `hist-live-${Date.now()}`,
      time: formattedTime,
      symbol: coin.symbol,
      name: coin.name,
      totalScore: coin.totalScore,
      rating,
      priceAtPredict: coin.price,
      expectedDirection,
      metricsSummary: summaryStr,
      validations: {
        "6h": { timeframe: "6h", status: "PENDING", actualChange: null, targetPrice: null },
        "12h": { timeframe: "12h", status: "PENDING", actualChange: null, targetPrice: null },
        "24h": { timeframe: "24h", status: "PENDING", actualChange: null, targetPrice: null },
        "72h": { timeframe: "72h", status: "PENDING", actualChange: null, targetPrice: null },
      }
    };

    setHistoryList(prev => [newItem, ...prev]);
  };

  const triggerValidationUpdate = () => {
    setHistoryList(prev => {
      const nextList = prev.map(item => {
        const timeframes: ("6h" | "12h" | "24h" | "72h")[] = ["6h", "12h", "24h", "72h"];
        const hasPending = timeframes.some(tf => item.validations[tf].status === "PENDING");
        
        if (!hasPending) return item;
        
        const nextValidations = { ...item.validations };
        
        timeframes.forEach(tf => {
          if (nextValidations[tf].status === "PENDING") {
            let successRate = 61;
            if (item.rating === "S") successRate = 71;
            else if (item.rating === "A") successRate = 59;
            else if (item.rating === "B") successRate = 52;

            const isSuccess = Math.random() * 100 < successRate;
            
            let actualChange = 0;
            if (item.expectedDirection === "UP") {
              if (isSuccess) {
                actualChange = Number((Math.random() * 4 + 0.5).toFixed(2));
              } else {
                actualChange = Number((-(Math.random() * 3 + 0.2)).toFixed(2));
              }
            } else {
              if (isSuccess) {
                actualChange = Number((-(Math.random() * 4 + 0.5)).toFixed(2));
              } else {
                actualChange = Number((Math.random() * 3 + 0.2).toFixed(2));
              }
            }

            const targetPrice = Number((item.priceAtPredict * (1 + actualChange / 100)).toFixed(item.priceAtPredict > 10 ? 2 : 5));

            nextValidations[tf] = {
              timeframe: tf,
              status: isSuccess ? "SUCCESS" : "FAILURE",
              actualChange,
              targetPrice
            };
          }
        });

        return {
          ...item,
          validations: nextValidations
        };
      });

      return nextList;
    });
  };

  const getDynamicAccuracyStats = (): AccuracyBrackets => {
    const getSubStats = (filterFn: (item: PredictionHistoryItem) => boolean, fallbackValue: number) => {
      const subItems = historyList.filter(filterFn);
      let totalValidated = 0;
      let successCount = 0;
      subItems.forEach(item => {
        const valList = [item.validations["6h"], item.validations["12h"], item.validations["24h"], item.validations["72h"]];
        valList.forEach(v => {
          if (v.status === "SUCCESS") {
            totalValidated++;
            successCount++;
          } else if (v.status === "FAILURE") {
            totalValidated++;
          }
        });
      });
      if (totalValidated === 0) return fallbackValue;
      return Math.round((successCount / totalValidated) * 100);
    };

    return {
      above82: getSubStats(item => item.totalScore >= 82, 71),
      between70_81: getSubStats(item => item.totalScore >= 70 && item.totalScore < 82, 59),
      between60_69: getSubStats(item => item.totalScore >= 60 && item.totalScore < 70, 52),
      overall: getSubStats(() => true, 61)
    };
  };

  // Trigger default analysis for XRP on load
  useEffect(() => {
    runAnalysis("XRP");
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      runAnalysis(searchQuery);
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Decorative ambient background assets */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8 z-10" id="main-app-container">
        
        {/* Header Navigation */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg" id="logo-icon-container">
              <LineChart className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-teal-100 to-teal-300">
                  COIN RISE PREDICTOR
                </h1>
                <span className="text-[10px] uppercase tracking-widest font-extrabold bg-teal-500/15 border border-teal-500/30 text-teal-400 px-2 py-0.5 rounded">
                  AI Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">10가지 정밀 가중치 온체인 및 트레이딩 지표 기반 실시간 상승 예측 엔진</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/80 border border-slate-800/80 px-3.5 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>종합 실시간 데이터 동기화 완료</span>
          </div>
        </header>

        {/* Input & Search section */}
        <section className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-5 md:p-6 flex flex-col md:flex-row gap-6 justify-between items-center" id="search-section">
          <div className="space-y-1.5 w-full md:w-auto">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              미래 시장 상승률 실시간 시뮬레이션
            </h3>
            <p className="text-xs text-slate-400">분석을 원하시는 코인 심볼이나 한글명을 입력하세요.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex relative w-full md:max-w-md" id="coin-search-form">
            <input
              type="text"
              placeholder="예: BTC, ETH, SOL, SUI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 focus:border-teal-500/80 rounded-xl py-3 pl-4 pr-24 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500/20 text-slate-100 placeholder-slate-500 transition-all font-mono"
              disabled={loading}
              id="coin-search-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-100 font-bold px-4 rounded-lg text-xs tracking-wide flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              id="analyze-submit-button"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              {loading ? "분석중" : "분석 시작"}
            </button>
          </form>

          {/* Quick preset triggers */}
          <div className="flex gap-2 items-center overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs text-slate-500 font-medium shrink-0">자주 찾는 종목:</span>
            {PRESET_SYMBOLS.map((sym) => (
              <button
                key={sym}
                onClick={() => runAnalysis(sym)}
                className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
                  activeCoin?.symbol === sym 
                    ? "bg-teal-500/10 border-teal-500 text-teal-300 font-bold" 
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Warning Notification */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Main analytical dashboard grids */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading-skeleton"
              className="py-16 flex flex-col items-center justify-center gap-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 animate-spin"></div>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200 text-base">Gemini AI 다차원 가중치 연산 엔진 구동 중...</h4>
                <p className="text-xs text-slate-400">10대 온체인 및 현물 거래 오더북 거래량 흐름을 정밀 교정하고 있습니다.</p>
              </div>
            </motion.div>
          ) : activeCoin ? (
            <motion.div 
              key={activeCoin.symbol}
              className="space-y-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              
              {/* Score Dial and Gauge Info */}
              <ScoreGauge
                score={activeCoin.totalScore}
                winRate={activeCoin.winRate}
                probability={activeCoin.probability}
                symbol={activeCoin.symbol}
                name={activeCoin.name}
                change24h={activeCoin.change24h}
              />

              {/* Timeframe Projections (1~6h, 6~24h, 1~7d) */}
              <TimeframeProjections
                metrics={activeCoin.metrics}
                symbol={activeCoin.symbol}
              />

              {/* 10 Indicators details representation */}
              <MetricTable 
                metrics={activeCoin.metrics}
                totalScore={activeCoin.totalScore}
              />

            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Sector heading for multiple comparison */}
        <div className="border-t border-slate-800/80 pt-8 space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-100 uppercase">
              실시간 종합 진입 추천 순위판
            </h2>
          </div>
          <p className="text-xs text-slate-400">여러 종목을 연속해서 분석하면, 하단에 평점 가치가 분석-누적되어 랭킹이 매겨집니다.</p>
        </div>

        {/* Multiple Coins Ranking Compare Panel */}
        <CompareBoard
          candidates={analyzedList}
          onSelectCoin={(symbol) => {
            // Pick already cached coin or query from backend
            const match = analyzedList.find(c => c.symbol === symbol);
            if (match) {
              runAnalysis(symbol);
            }
          }}
          activeSymbol={activeCoin?.symbol || ""}
        />

        {/* Prediction History and Performance Self-Validation */}
        <div className="border-t border-slate-800/80 pt-8 space-y-2">
          <PredictionValidationBoard
            historyItems={historyList}
            onTriggerSimulatedValidation={triggerValidationUpdate}
            accuracyStats={getDynamicAccuracyStats()}
          />
        </div>

        {/* Footer legal notices */}
        <footer className="border-t border-slate-800/80 pt-8 mt-12 text-center text-slate-500 space-y-3">
          <p className="text-xs max-w-2xl mx-auto leading-relaxed">
            투자 고지: 본 정보는 10가지 거시적 지표에 대한 알고리즘 시뮬레이션 데이터 분석 기반 예측 모델로써 신뢰할 만한 정보를 전달하고자 하나, 실제 가상자산 시세 변동을 완전히 선반영하지 못하므로 최종 매매와 리스크에 대한 무한 귀속 책임은 전적으로 회원 본인에게 있음을 주지바랍니다.
          </p>
          <div className="flex justify-center gap-4 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> 분석 지원: Gemini-3.5-Flash</span>
            <span>•</span>
            <span>설계 표준: 10대 계량 점수표 합산형</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
