import { motion } from "motion/react";
import { CopyCheck, ArrowUpDown, Award, CheckCircle2, ChevronRight, Scale } from "lucide-react";
import { CompareResult } from "../types";

interface CompareBoardProps {
  candidates: CompareResult[];
  onSelectCoin: (symbol: string) => void;
  activeSymbol: string;
}

export default function CompareBoard({
  candidates,
  onSelectCoin,
  activeSymbol
}: CompareBoardProps) {
  
  // Sort candidates by score descending to find rankings
  const sortedCandidates = [...candidates].sort((a, b) => b.totalScore - a.totalScore);

  // Return rank medal or number
  const getRankBadge = (idx: number) => {
    switch (idx) {
      case 0:
        return <span className="text-xl">🥇</span>;
      case 1:
        return <span className="text-xl">🥈</span>;
      case 2:
        return <span className="text-xl">🥉</span>;
      default:
        return <span className="font-mono font-bold text-slate-500 text-sm pl-1">{idx + 1}</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="compare-board-module">
      
      {/* Weight Reference Sheet (실제 투자용 점수표) */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Scale className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm">실제 투자용 점수표 (배점 기준)</h3>
        </div>
        
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">🥇 Spot CVD <span className="text-amber-400/80">★★★★★</span></span>
            <span className="font-mono font-bold text-slate-400">25점</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">🥈 OI (미결제약정) <span className="text-amber-400/80">★★★★★</span></span>
            <span className="font-mono font-bold text-slate-400">20점</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">🥉 청산맵 <span className="text-amber-400/80">★★★★☆</span></span>
            <span className="font-mono font-bold text-slate-400">15점</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">고래 Netflow (온체인) <span className="text-amber-400/80">★★★★☆</span></span>
            <span className="font-mono font-bold text-slate-400">15점</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">거래량 (24H) <span className="text-amber-400/65">★★★☆☆</span></span>
            <span className="font-mono font-bold text-slate-400">10점</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">Funding Rate <span className="text-amber-400/40">★★☆☆☆</span></span>
            <span className="font-mono text-slate-400 font-bold">3점</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">BTC Dominance <span className="text-amber-400/40">★★☆☆☆</span></span>
            <span className="font-mono text-slate-400 font-bold">3점</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">Futures CVD <span className="text-amber-400/40">★★☆☆☆</span></span>
            <span className="font-mono text-slate-400 font-bold">3점</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">RSI(14) (기술 지표) <span className="text-amber-400/20">★☆☆☆☆</span></span>
            <span className="font-mono text-slate-500">2점</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">MACD (추세 지표) <span className="text-amber-400/20">★☆☆☆☆</span></span>
            <span className="font-mono text-slate-500">2점</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">스테이블 유입 <span className="text-amber-400/20">★☆☆☆☆</span></span>
            <span className="font-mono text-slate-500">2점</span>
          </div>
          
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between font-bold text-slate-200">
            <span>계 산 총 점</span>
            <span className="text-teal-400 font-mono">총점 100점</span>
          </div>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed space-y-1">
          <p className="font-semibold text-slate-300">📊 진입 진단 등급 안내</p>
          <p>• 85점 이상 (S): 하락 리스크 극최소, 강력 매수</p>
          <p>• 70점 이상 (A): 상승 시그널 점화, 분할 매수</p>
          <p>• 50점 이상 (B): 추세 기세 확인 대기형 관망</p>
          <p>• 50점 미만 (C/D): 보수적 진입 회피 권장</p>
        </div>
      </div>

      {/* Comparison Scoreboard and Ranking (종목 매수 평점 비교) */}
      <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CopyCheck className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-slate-100 text-base">분석된 코인 진입 매수 평점 비교</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">총 {candidates.length}개 종목 비교 분석 결과</span>
        </div>

        {sortedCandidates.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            상단 보드에서 가중치 분석을 수행한 뒤 종목을 추가해 보세요!
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCandidates.map((coin, idx) => {
              const isActive = coin.symbol === activeSymbol;
              
              return (
                <div 
                  key={coin.symbol}
                  onClick={() => onSelectCoin(coin.symbol)}
                  className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${
                    isActive 
                      ? "bg-slate-800/80 border-teal-500/50 shadow-md ring-1 ring-teal-500/20" 
                      : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-800/20"
                  }`}
                >
                  {/* Left rank/meta section */}
                  <div className="flex items-center gap-3 z-10">
                    <div className="w-8 flex justify-center">{getRankBadge(idx)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 group-hover:text-teal-400 transition-colors uppercase">{coin.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-950/60 px-1.5 py-0.5 rounded">{coin.symbol}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        승률: <span className="text-teal-400 font-semibold">{coin.winRate}%</span> / 상승 신뢰도: <span className="text-indigo-400 font-semibold">{coin.probability}%</span>
                      </p>
                    </div>
                  </div>

                  {/* Mid score bar illustration */}
                  <div className="flex-1 max-w-xs sm:mx-6 z-10">
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>매수 평점</span>
                      <span className="text-slate-200 font-bold">{coin.totalScore} / 100</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                      <motion.div 
                        className={`h-full rounded-full ${
                          coin.totalScore >= 85 
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
                            : coin.totalScore >= 70 
                            ? "bg-gradient-to-r from-teal-500 to-cyan-400" 
                            : coin.totalScore >= 50 
                            ? "bg-gradient-to-r from-indigo-500 to-indigo-400" 
                            : "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-400"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${coin.totalScore}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Right badge and chevron select action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 z-10">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${coin.color}`}>
                      {coin.rating} • {coin.badge}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Suggestion Summary and Advice */}
        {sortedCandidates.length > 0 && (
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-slate-400">
            <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-300">💡 봇 가중치 기반 최종 포트폴리오 진입 처방전</span>
              <p>
                현재 분석된 {sortedCandidates.length}개 종목 중 실제 구매가 가장 유리한 코인은 평점{" "}
                <strong className="text-slate-100">{sortedCandidates[0].totalScore}점</strong>을 획득한{" "}
                <strong className="text-teal-400">[{sortedCandidates[0].name}]</strong>입니다. 
                {sortedCandidates[0].totalScore >= 70 
                  ? " 이 종목은 현물 지지력 및 OI 유입 세기가 탁월하므로 현재 타이밍에서 우선 분할 매수를 강력히 보장합니다." 
                  : " 전체적으로 S/A 등급의 코인이 포집되지 않아, 즉각적인 진입보다는 관망세를 늘리는 것을 권장합니다."}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
