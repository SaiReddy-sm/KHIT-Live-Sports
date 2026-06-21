import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';

// ==========================================
// 1. GLOBAL CONSTANTS & PURE HELPER UTILITIES
// ==========================================
const SPORTS = ["Cricket", "Volleyball", "Basketball", "Kabaddi", "Badminton", "Table Tennis", "Chess", "Throwball", "Athletics", "Others"];
const STATUSES = ["Upcoming", "Live", "Completed"];
const LOGO_FALLBACK = "logo.jpg";

function getRequiredPlayerCount(sport) {
  switch (sport) {
    case "Cricket": return 11;
    case "Kabaddi": return 7;
    case "Volleyball": return 6;
    case "Basketball": return 5;
    case "Badminton": return 2;
    case "Table Tennis": return 2;
    case "Chess": return 1;
    default: return 11;
  }
}

function parseCricketScore(scoreStr) {
  if (!scoreStr) return { runs: 0, wickets: 0, overs: 0 };
  const match = scoreStr.match(/^(\d+)\/(\d+)\s*\(([\d.]+)\s*Ov\)/);
  if (match) {
    return { runs: parseInt(match[1], 10), wickets: parseInt(match[2], 10), overs: parseFloat(match[3]) };
  }
  return { runs: 0, wickets: 0, overs: 0 };
}

function calculateCRRForMatch(scoreStr) {
  const { runs, overs } = parseCricketScore(scoreStr);
  const totalBalls = Math.floor(overs) * 6 + Math.round((overs % 1) * 10);
  if (totalBalls === 0) return "0.00";
  return ((runs / totalBalls) * 6).toFixed(2);
}

function calculateRRRForMatch(matchObj) {
  const statsObj = matchObj.stats || {};
  if (!statsObj.targetRuns) return "0.00";

  const isTeamAFirstBat =
    (statsObj.tossWinner === matchObj.teamA && statsObj.tossDecision === "Bat") ||
    (statsObj.tossWinner === matchObj.teamB && statsObj.tossDecision === "Bowl");

  const chasingScoreStr = (statsObj.cricketInnings === 2) 
    ? (isTeamAFirstBat ? matchObj.scoreB : matchObj.scoreA) 
    : "";

  const { runs, overs } = parseCricketScore(chasingScoreStr);
  const maxBalls = (statsObj.matchOvers || 20) * 6;
  const totalBallsBowed = Math.floor(overs) * 6 + Math.round((overs % 1) * 10);
  const ballsRemaining = maxBalls - totalBallsBowed;
  const runsRequired = statsObj.targetRuns - runs;

  if (ballsRemaining <= 0 || runsRequired <= 0) return "0.00";
  return ((runsRequired / ballsRemaining) * 6).toFixed(2);
}

// ==========================================
// 2. MAIN COMPONENT EXPORT
// ==========================================
export default function ManageMatches() {
  // --- STATE DECLARATIONS FIRST ---
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingPublicDetailId, setViewingPublicDetailId] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);

  const [formSport, setFormSport] = useState("Cricket");
  const [formCustomSport, setFormCustomSport] = useState("");
  const [formTournament, setFormTournament] = useState("Annual Sports Meet 2026");
  const [formVenue, setFormVenue] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formStatus, setFormStatus] = useState("Upcoming");
  const [formStatusDetail, setFormStatusDetail] = useState("");
  const [formWinner, setFormWinner] = useState("");
  const [formGender, setFormGender] = useState("Mens");
  const [formMatchType, setFormMatchType] = useState("T20");

  const [formTeamA, setFormTeamA] = useState("");
  const [formTeamB, setFormTeamB] = useState("");
  const [formCaptainA, setFormCaptainA] = useState("");
  const [formCaptainB, setFormCaptainB] = useState("");
  const [formWkA, setFormWkA] = useState("");
  const [formWkB, setFormWkB] = useState("");

  const [formTeamARoster, setFormTeamARoster] = useState([]);
  const [formTeamBRoster, setFormTeamBRoster] = useState([]);

  const [formScoreA, setFormScoreA] = useState("");
  const [formScoreB, setFormScoreB] = useState("");

  const [tossWinner, setTossWinner] = useState("");
  const [tossDecision, setTossDecision] = useState("Bat");
  const [matchOvers, setMatchOvers] = useState(20);

  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [currentBowler, setCurrentBowler] = useState("");
  const [cricketInnings, setCricketInnings] = useState(1);
  const [targetRuns, setTargetRuns] = useState(null);

  const [scoringHistory, setScoringHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const [batsmenStats, setBatsmenStats] = useState({});
  const [bowlerStats, setBowlerStats] = useState({});
  const [ballHistory, setBallHistory] = useState([]);
  const [currentOverBalls, setCurrentOverBalls] = useState([]);
  const [fallOfWickets, setFallOfWickets] = useState([]);
  const [overTimelines, setOverTimelines] = useState([]);

  const [wicketModalOpen, setWicketModalOpen] = useState(false);
  const [pendingWicketType, setPendingWicketType] = useState("Bowled");
  const [pendingDismissedBatsman, setPendingDismissedBatsman] = useState("");

  const [bowlerModalOpen, setBowlerModalOpen] = useState(false);

  const [volleyballStats, setVolleyballStats] = useState({ pointsA: 0, pointsB: 0, setsA: 0, setsB: 0 });
  const [basketballStats, setBasketballStats] = useState({ scoreA: 0, scoreB: 0, currentQuarter: 1 });
  const [kabaddiStats, setKabaddiStats] = useState({ scoreA: 0, scoreB: 0, raidsA: 0, tacklesA: 0, raidsB: 0, tacklesB: 0, bonusA: 0, bonusB: 0, allOutA: 0, allOutB: 0 });
  const [badmintonStats, setBadmintonStats] = useState({ pointsA: 0, pointsB: 0, gamesA: 0, gamesB: 0 });
  const [tableTennisStats, setTableTennisStats] = useState({ pointsA: 0, pointsB: 0, gamesA: 0, gamesB: 0 });

  // --- HOISTED COMPONENT HELPERS ---
  const getCricketRoles = () => {
    const isTeamAFirstBat =
      (tossWinner === formTeamA && tossDecision === "Bat") ||
      (tossWinner === formTeamB && tossDecision === "Bowl");

    let battingTeamName = "";
    let bowlingTeamName = "";
    let battingRoster = [];
    let bowlingRoster = [];

    if (cricketInnings === 1) {
      battingTeamName = isTeamAFirstBat ? formTeamA : formTeamB;
      bowlingTeamName = isTeamAFirstBat ? formTeamB : formTeamA;
      battingRoster = isTeamAFirstBat ? formTeamARoster : formTeamBRoster;
      bowlingRoster = isTeamAFirstBat ? formTeamBRoster : formTeamARoster;
    } else {
      battingTeamName = isTeamAFirstBat ? formTeamB : formTeamA;
      bowlingTeamName = isTeamAFirstBat ? formTeamA : formTeamB;
      battingRoster = isTeamAFirstBat ? formTeamBRoster : formTeamARoster;
      bowlingRoster = isTeamAFirstBat ? formTeamARoster : formTeamBRoster;
    }

    return { battingTeamName, bowlingTeamName, battingRoster, bowlingRoster };
  };

  const getInningsLabels = () => {
    const { battingTeamName } = getCricketRoles();
    if (cricketInnings === 1) {
      return {
        teamABadge: battingTeamName === formTeamA ? "Active Batting" : "Yet to Bat",
        teamBBadge: battingTeamName === formTeamB ? "Active Batting" : "Yet to Bat"
      };
    } else {
      return {
        teamABadge: battingTeamName === formTeamA ? "Active Chase (Innings 2)" : "Innings Completed",
        teamBBadge: battingTeamName === formTeamB ? "Active Chase (Innings 2)" : "Innings Completed"
      };
    }
  };

  // Safe manual sport changes handler
  const handleSportChange = (sport) => {
    setFormSport(sport);
    if (!isEditing) {
      const slots = getRequiredPlayerCount(sport);
      setFormTeamARoster(Array.from({ length: slots }, () => ({ name: "", rollNo: "" })));
      setFormTeamBRoster(Array.from({ length: slots }, () => ({ name: "", rollNo: "" })));
    }
  };

  // Safe manual roster size updates
  const updatePlayerRow = (team, idx, field, value) => {
    if (team === "A") {
      setFormTeamARoster(prev => {
        const next = [...prev];
        const currentObj = next[idx] || { name: "", rollNo: "" };
        next[idx] = { ...currentObj, [field]: value };
        return next;
      });
    } else {
      setFormTeamBRoster(prev => {
        const next = [...prev];
        const currentObj = next[idx] || { name: "", rollNo: "" };
        next[idx] = { ...currentObj, [field]: value };
        return next;
      });
    }
  };

  const getBatsmanStat = (name) => {
    return batsmenStats[name] || { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 };
  };

  const getBowlerStat = (name) => {
    return bowlerStats[name] || { oversCount: 0, maidens: 0, runsConceded: 0, wickets: 0, ballsCount: 0, economy: 0 };
  };

  // Undo/Redo Engine Helpers
  const saveScoringStateToStack = () => {
    const currentState = {
      formScoreA,
      formScoreB,
      striker,
      nonStriker,
      currentBowler,
      cricketInnings,
      targetRuns,
      batsmenStats: JSON.parse(JSON.stringify(batsmenStats)),
      bowlerStats: JSON.parse(JSON.stringify(bowlerStats)),
      ballHistory: [...ballHistory],
      currentOverBalls: [...currentOverBalls],
      fallOfWickets: [...fallOfWickets],
      overTimelines: [...overTimelines]
    };
    setScoringHistory(prev => [...prev, currentState]);
    setRedoHistory([]);
  };

  const handleUndo = () => {
    if (scoringHistory.length === 0) return;
    const previous = scoringHistory[scoringHistory.length - 1];
    
    const current = {
      formScoreA,
      formScoreB,
      striker,
      nonStriker,
      currentBowler,
      cricketInnings,
      targetRuns,
      batsmenStats: JSON.parse(JSON.stringify(batsmenStats)),
      bowlerStats: JSON.parse(JSON.stringify(bowlerStats)),
      ballHistory: [...ballHistory],
      currentOverBalls: [...currentOverBalls],
      fallOfWickets: [...fallOfWickets],
      overTimelines: [...overTimelines]
    };
    setRedoHistory(prev => [...prev, current]);

    setFormScoreA(previous.formScoreA);
    setFormScoreB(previous.formScoreB);
    setStriker(previous.striker);
    setNonStriker(previous.nonStriker);
    setCurrentBowler(previous.currentBowler);
    setCricketInnings(previous.cricketInnings);
    setTargetRuns(previous.targetRuns);
    setBatsmenStats(previous.batsmenStats);
    setBallHistory(previous.ballHistory);
    setCurrentOverBalls(previous.currentOverBalls);
    setFallOfWickets(previous.fallOfWickets);
    setOverTimelines(previous.overTimelines);

    setScoringHistory(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;
    const nextState = redoHistory[redoHistory.length - 1];

    const current = {
      formScoreA,
      formScoreB,
      striker,
      nonStriker,
      currentBowler,
      cricketInnings,
      targetRuns,
      batsmenStats: JSON.parse(JSON.stringify(batsmenStats)),
      bowlerStats: JSON.parse(JSON.stringify(bowlerStats)),
      ballHistory: [...ballHistory],
      currentOverBalls: [...currentOverBalls],
      fallOfWickets: [...fallOfWickets],
      overTimelines: [...overTimelines]
    };
    setScoringHistory(prev => [...prev, current]);

    setFormScoreA(nextState.formScoreA);
    setFormScoreB(nextState.formScoreB);
    setStriker(nextState.striker);
    setNonStriker(nextState.nonStriker);
    setCurrentBowler(nextState.currentBowler);
    setCricketInnings(nextState.cricketInnings);
    setTargetRuns(nextState.targetRuns);
    setBatsmenStats(nextState.batsmenStats);
    setBowlerStats(nextState.bowlerStats);
    setBallHistory(nextState.ballHistory);
    setCurrentOverBalls(nextState.currentOverBalls);
    setFallOfWickets(nextState.fallOfWickets);
    setOverTimelines(nextState.overTimelines);

    setRedoHistory(prev => prev.slice(0, -1));
  };

  const updateBatsmanMap = (name, key, amount) => {
    setBatsmenStats(prev => {
      const current = prev[name] || { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 };
      const updatedValue = current[key] + amount;
      const nextStat = { ...current, [key]: updatedValue };
      if (key === "runs" || key === "balls") {
        const nextRuns = key === "runs" ? updatedValue : current.runs;
        const nextBalls = key === "balls" ? updatedValue : current.balls;
        nextStat.strikeRate = nextBalls > 0 ? parseFloat(((nextRuns / nextBalls) * 100).toFixed(1)) : 0;
      }
      return { ...prev, [name]: nextStat };
    });
  };

  const updateBowlerMap = (name, key, amount) => {
    setBowlerStats(prev => {
      const current = prev[name] || { oversCount: 0, maidens: 0, runsConceded: 0, wickets: 0, ballsCount: 0, economy: 0 };
      const updatedValue = current[key] + amount;
      const nextStat = { ...current, [key]: updatedValue };

      if (key === "ballsCount" || key === "runsConceded") {
        const nextBalls = key === "ballsCount" ? updatedValue : current.ballsCount;
        const nextRuns = key === "runsConceded" ? updatedValue : current.runsConceded;
        nextStat.oversCount = parseFloat((Math.floor(nextBalls / 6) + (nextBalls % 6) / 10).toFixed(1));
        const totalOversDec = nextBalls / 6;
        nextStat.economy = totalOversDec > 0 ? parseFloat((nextRuns / totalOversDec).toFixed(2)) : 0;
      }
      return { ...prev, [name]: nextStat };
    });
  };

  const handleCricketBall = (runsEarned, isExtra = false, extraType = "", isWicket = false) => {
    saveScoringStateToStack();

    const { battingTeamName } = getCricketRoles();
    const isTeamABatting = battingTeamName === formTeamA;

    const currentBatScore = isTeamABatting ? formScoreA : formScoreB;
    const { runs: teamRuns, wickets: teamWickets, overs: teamOvers } = parseCricketScore(currentBatScore);

    let nextRuns = teamRuns;
    let nextWickets = teamWickets;
    let nextOvers = teamOvers;

    if (isExtra) {
      nextRuns += 1;
      if (extraType === "Wide" || extraType === "NoBall") {
        nextRuns += runsEarned;
      } else if (extraType === "Bye" || extraType === "LegBye") {
        nextRuns += runsEarned;
        nextOvers = calculateNextOverValue(nextOvers);
        if (striker) updateBatsmanMap(striker, "balls", 1);
        if (currentBowler) updateBowlerMap(currentBowler, "ballsCount", 1);
      }
    } else {
      nextRuns += runsEarned;
      nextOvers = calculateNextOverValue(nextOvers);
      if (striker) {
        updateBatsmanMap(striker, "runs", runsEarned);
        updateBatsmanMap(striker, "balls", 1);
        if (runsEarned === 4) updateBatsmanMap(striker, "fours", 1);
        if (runsEarned === 6) updateBatsmanMap(striker, "sixes", 1);
      }
      if (currentBowler) {
        updateBowlerMap(currentBowler, "ballsCount", 1);
        updateBowlerMap(currentBowler, "runsConceded", runsEarned);
      }
    }

    let deliveryLabel = runsEarned.toString();
    if (isWicket) deliveryLabel = "W";
    else if (extraType === "Wide") deliveryLabel = `${runsEarned}Wd`;
    else if (extraType === "NoBall") deliveryLabel = `${runsEarned}Nb`;
    else if (extraType === "Bye") deliveryLabel = `${runsEarned}B`;
    else if (extraType === "LegBye") deliveryLabel = `${runsEarned}Lb`;

    const updatedOverBalls = [...currentOverBalls, deliveryLabel];
    setCurrentOverBalls(updatedOverBalls);

    const stepDescription = `${currentBowler || "Bowler"} to ${striker || "Batsman"}: ${deliveryLabel} (${nextRuns}/${nextWickets})`;
    setBallHistory(prev => [{ text: stepDescription, runsEarned, isExtra, extraType, isWicket, striker, nonStriker, bowler: currentBowler }, ...prev]);

    let nextStriker = striker;
    let nextNonStriker = nonStriker;
    if (!isWicket && (runsEarned === 1 || runsEarned === 3 || runsEarned === 5)) {
      nextStriker = nonStriker;
      nextNonStriker = striker;
      setStriker(nextStriker);
      setNonStriker(nextNonStriker);
    }

    const outputScore = `${nextRuns}/${nextWickets} (${nextOvers} Ov)`;
    if (isTeamABatting) {
      setFormScoreA(outputScore);
    } else {
      setFormScoreB(outputScore);
    }

    if (cricketInnings === 2 && targetRuns && nextRuns >= targetRuns) {
      setFormStatus("Completed");
      const winnerName = isTeamABatting ? formTeamA : formTeamB;
      const margin = 10 - nextWickets;
      setFormWinner(`${winnerName} won by ${margin} wickets`);
      setFormStatusDetail("Innings completed. Concluding Match.");
      return;
    }

    if (isWicket) {
      setPendingDismissedBatsman(striker);
      setWicketModalOpen(true);
      return;
    }

    const completedLegalBalls = updatedOverBalls.filter(b => !b.includes("Wd") && !b.includes("Nb")).length;
    if (completedLegalBalls >= 6) {
      setOverTimelines(prev => [...prev, { overNo: Math.ceil(nextOvers), balls: updatedOverBalls }]);
      setStriker(nextNonStriker);
      setNonStriker(nextStriker);
      setCurrentOverBalls([]);
      setFormStatusDetail(`Over completed.`);

      const currentBallsTotal = Math.round((nextOvers % 1) * 10) + Math.floor(nextOvers) * 6;
      if (currentBallsTotal >= matchOvers * 6) {
        handleInningsEnd(nextRuns);
      } else {
        setBowlerModalOpen(true);
      }
    }
  };

  const confirmWicketDismissal = (newBatsmanName, targetedDismissed) => {
    if (!newBatsmanName || !targetedDismissed) return;

    if (currentBowler) {
      updateBowlerMap(currentBowler, "wickets", 1);
    }

    const { battingTeamName } = getCricketRoles();
    const isTeamABatting = battingTeamName === formTeamA;

    const currentBatScore = isTeamABatting ? formScoreA : formScoreB;
    const { runs, wickets, overs } = parseCricketScore(currentBatScore);
    const nextWickets = wickets + 1;

    const wicketLabel = `${nextWickets}-${runs} (${targetedDismissed}, ${overs})`;
    setFallOfWickets(prev => [...prev, wicketLabel]);

    const nextScore = `${runs}/${nextWickets} (${overs} Ov)`;
    if (isTeamABatting) {
      setFormScoreA(nextScore);
    } else {
      setFormScoreB(nextScore);
    }

    setBatsmenStats(prev => ({
      ...prev,
      [newBatsmanName]: { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 }
    }));

    if (targetedDismissed === striker) {
      setStriker(newBatsmanName);
    } else {
      setNonStriker(newBatsmanName);
    }

    setWicketModalOpen(false);

    const completedLegalBalls = currentOverBalls.filter(b => !b.includes("Wd") && !b.includes("Nb")).length;
    if (completedLegalBalls >= 6) {
      setStriker(nonStriker);
      setNonStriker(newBatsmanName);
      setCurrentOverBalls([]);
      setBowlerModalOpen(true);
    } else {
      if (nextWickets >= 10) {
        handleInningsEnd(runs);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formTeamA || !formTeamB || formTeamA === formTeamB) {
      alert("Please configure two distinct custom team names.");
      return;
    }

    try {
      const token = localStorage.getItem("adminAuth");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      };

      let activeStatsPayload = {};
      if (formSport === "Cricket") {
        activeStatsPayload = {
          tossWinner,
          tossDecision,
          matchOvers,
          striker,
          nonStriker,
          currentBowler,
          cricketInnings,
          targetRuns,
          batsmenStats,
          bowlerStats,
          ballHistory,
          currentOverBalls,
          fallOfWickets,
          overTimelines
        };
      } else {
        activeStatsPayload = {
          volleyballStats,
          basketballStats,
          kabaddiStats,
          badmintonStats,
          tableTennisStats
        };
      }

      const payload = {
        sport: formSport === "Others" ? formCustomSport : formSport,
        tournament: formTournament,
        venue: formVenue || "Main Ground",
        date: formDate,
        time: formTime,
        status: formStatus,
        statusDetail: formStatusDetail,
        teamA: formTeamA,
        captainA: formCaptainA || "Not Named",
        wkA: formWkA,
        teamB: formTeamB,
        captainB: formCaptainB || "Not Named",
        wkB: formWkB,
        teamA_roster: formTeamARoster.filter(p => p.name.trim() !== ""),
        teamB_roster: formTeamBRoster.filter(p => p.name.trim() !== ""),
        scoreA: formStatus === "Upcoming" ? "" : formScoreA,
        scoreB: formStatus === "Upcoming" ? "" : formScoreB,
        winner: formStatus === "Completed" ? formWinner : "",
        gender: formGender,
        matchType: formMatchType,
        stats: activeStatsPayload
      };

      let url = "http://localhost:5000/api/matches";
      let method = "POST";

      if (isEditing && activeMatch) {
        url = `http://localhost:5000/api/matches/${activeMatch._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        fetchInitialData();
        setIsFormOpen(false);
      } else {
        throw new Error(result.message || "Failed to update database.");
      }
    } catch (err) {
      alert(`Error synchronizing match records: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this match record?")) return;
    try {
      const token = localStorage.getItem("adminAuth");
      const response = await fetch(`http://localhost:5000/api/matches/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      });
      if (response.ok) fetchInitialData();
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [matchesRes, teamsRes] = await Promise.all([
        fetch("http://localhost:5000/api/matches").then(res => res.json()),
        fetch("http://localhost:5000/api/teams").then(res => res.json())
      ]);

      if (matchesRes.success) setMatches(matchesRes.data);
      if (teamsRes.success) setTeams(teamsRes.data);
    } catch (err) {
      setError(err.message || "Failed to load database collections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Sub-render block safely compiled
  const renderPublicScorecard = () => {
    const match = matches.find(m => m._id === viewingPublicDetailId);
    if (!match) return null;
    const statsObj = match.stats || {};
    const isLive = match.status === "Live";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-xs">
        <div className="bg-white w-full max-w-2xl h-screen shadow-2xl overflow-y-auto p-6 space-y-6 animate-fade-in text-xs md:text-sm">
          
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">{match.teamA} vs {match.teamB}</h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase">{match.tournament} • {match.gender}</p>
            </div>
            <button 
              onClick={() => setViewingPublicDetailId(null)}
              className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-500 font-bold text-base"
            >
              ✕
            </button>
          </div>

          <section className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Venue</span>
                <strong className="text-slate-700">{match.venue}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Date & Time</span>
                <strong className="text-slate-700">{match.date} • {match.time}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Format</span>
                <strong className="text-slate-700">{match.matchType || "Standard"}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Toss</span>
                <strong className="text-slate-700">{statsObj.tossWinner ? `${statsObj.tossWinner} chose to ${statsObj.tossDecision}` : "N/A"}</strong>
              </div>
            </div>
          </section>

          <section className="bg-[#7A1E2D]/5 border-2 border-[#7A1E2D]/20 rounded-2xl p-6 text-center space-y-4">
            <span className="bg-red-100 text-[#7A1E2D] text-[10px] font-black px-3 py-1 rounded-full uppercase">
              {isLive ? "🔴 LIVE OUTCOMES" : "CONCLUDED"}
            </span>

            <div className="flex justify-around items-center">
              <div>
                <h4 className="text-slate-400 font-bold uppercase text-[11px] mb-1">{match.teamA}</h4>
                <span className="text-3xl font-black text-[#7A1E2D]">{match.scoreA || "0/0"}</span>
              </div>
              <span className="text-slate-300 font-black text-lg">VS</span>
              <div>
                <h4 className="text-slate-400 font-bold uppercase text-[11px] mb-1">{match.teamB}</h4>
                <span className="text-3xl font-black text-[#7A1E2D]">{match.scoreB || "0/0"}</span>
              </div>
            </div>

            {match.sport === "Cricket" && match.scoreA && (
              <div className="grid grid-cols-2 gap-4 text-slate-500 text-xs font-bold pt-4 border-t border-[#7A1E2D]/10">
                <div>CRR: {calculateCRRForMatch(match.scoreA)}</div>
                {statsObj.targetRuns && (
                  <div>
                    <span className="block">Target: {statsObj.targetRuns}</span>
                    <span>RRR: {calculateRRRForMatch(match)}</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {match.sport === "Cricket" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#7A1E2D] uppercase text-xs">Batting Scorecard</h4>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-black text-[10px]">
                      <th className="py-2">Batter</th>
                      <th className="py-2 text-right">R</th>
                      <th className="py-2 text-right">B</th>
                      <th className="py-2 text-right">4s</th>
                      <th className="py-2 text-right">6s</th>
                      <th className="py-2 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(statsObj.batsmenStats || {}).map((name) => {
                      const bs = statsObj.batsmenStats[name];
                      const isStriker = name === statsObj.striker;
                      const isWk = name === match.wkA || name === match.wkB;
                      const isCapt = name === match.captainA || name === match.captainB;
                      return (
                        <tr key={`score-bat-${name}`} className="border-b border-slate-100 font-semibold text-slate-700">
                          <td className="py-2 text-slate-900">
                            {isStriker && <span className="text-amber-500 mr-1">★</span>}
                            {name}
                            {isWk && <span className="ml-1 bg-slate-100 text-[9px] px-1 rounded text-slate-500">WK</span>}
                            {isCapt && <span className="ml-1 bg-slate-100 text-[9px] px-1 rounded text-slate-500">C</span>}
                          </td>
                          <td className="py-2 text-right font-black">{bs.runs}</td>
                          <td className="py-2 text-right text-slate-400">{bs.balls}</td>
                          <td className="py-2 text-right text-slate-400">{bs.fours}</td>
                          <td className="py-2 text-right text-slate-400">{bs.sixes}</td>
                          <td className="py-2 text-right text-slate-500">{bs.strikeRate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-[#7A1E2D] uppercase text-xs">Bowling Scorecard</h4>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-black text-[10px]">
                      <th className="py-2">Bowler</th>
                      <th className="py-2 text-right">O</th>
                      <th className="py-2 text-right">M</th>
                      <th className="py-2 text-right">R</th>
                      <th className="py-2 text-right">W</th>
                      <th className="py-2 text-right">Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(statsObj.bowlerStats || {}).map((name) => {
                      const bws = statsObj.bowlerStats[name];
                      return (
                        <tr key={`score-bowl-${name}`} className="border-b border-slate-100 font-semibold text-slate-700">
                          <td className="py-2 text-slate-900">{name}</td>
                          <td className="py-2 text-right">{bws.oversCount}</td>
                          <td className="py-2 text-right text-slate-400">{bws.maidens}</td>
                          <td className="py-2 text-right text-slate-400">{bws.runsConceded}</td>
                          <td className="py-2 text-right font-black text-slate-900">{bws.wickets}</td>
                          <td className="py-2 text-right text-slate-500">{bws.economy}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {statsObj.fallOfWickets && statsObj.fallOfWickets.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[#7A1E2D] uppercase text-xs">Fall of Wickets</h4>
                  <p className="text-slate-600 font-medium text-xs leading-relaxed">
                    {statsObj.fallOfWickets.join(" • ")}
                  </p>
                </div>
              )}

              {statsObj.overTimelines && statsObj.overTimelines.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-[#7A1E2D] uppercase text-xs">Over-by-Over Timeline</h4>
                  <div className="space-y-2">
                    {statsObj.overTimelines.map((ot, idx) => (
                      <div key={`over-${idx}`} className="flex items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-black text-slate-400">Over {ot.overNo}</span>
                        <div className="flex gap-1">
                          {ot.balls.map((b, bIdx) => (
                            <span key={`ball-${bIdx}`} className="bg-slate-200/80 px-2 py-0.5 rounded text-[10px] font-black">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center italic text-slate-400">Scorecard updates only tracked for Cricket categories.</p>
          )}

        </div>
      </div>
    );
  };

  const { battingRoster, bowlingRoster } = getCricketRoles();
  const labels = getInningsLabels();

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] flex flex-col lg:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-grow p-4 lg:p-8 pt-20 lg:pt-8 lg:ml-64 space-y-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#7A1E2D] rounded-full inline-block"></span>
              Sports Match Control
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 font-semibold">
              Live scoring engine, custom schedules panel, and team lineups controller.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            ➕ Setup Match
          </button>
        </div>

        <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            {["All", "Upcoming", "Live", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-black transition-all ${
                  activeTab === tab
                    ? "bg-[#7A1E2D] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search matchup or sport..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] font-medium"
            />
          </div>
        </section>

        <div className="bg-[#107A93] text-white p-4 rounded-t-2xl font-black text-center text-sm tracking-wider uppercase">
          Matches
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 overflow-hidden shadow-sm">
          {filteredMatches.map((match) => {
            const isMatchLive = match.status === "Live";
            return (
              <div 
                key={match._id} 
                onClick={() => setViewingPublicDetailId(match._id)}
                className="bg-white p-6 space-y-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>{match.tournament} • {match.matchType || "Overs"} ({match.gender || "Mens"})</span>
                  {isMatchLive ? (
                    <span className="text-red-600 font-extrabold animate-pulse flex items-center gap-1">🔴 LIVE</span>
                  ) : (
                    <span className="text-slate-400">{match.status}</span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/logo.jpg" 
                        onError={(e) => { e.target.src = LOGO_FALLBACK; }}
                        alt="logo" 
                        className="w-5 h-5 rounded-full object-cover" 
                      />
                      <span className="font-extrabold text-sm text-slate-900">{match.teamA}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src="/logo.jpg" 
                        onError={(e) => { e.target.src = LOGO_FALLBACK; }}
                        alt="logo" 
                        className="w-5 h-5 rounded-full object-cover" 
                      />
                      <span className="font-extrabold text-sm text-slate-900">{match.teamB}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-3 font-extrabold text-sm text-slate-900">
                    <div>{match.scoreA || "Yet to bat"}</div>
                    <div>{match.scoreB || "Yet to bat"}</div>
                  </div>
                </div>

                {match.statusDetail && (
                  <div className="text-[11px] text-slate-500 font-bold bg-slate-50 p-2 rounded-lg">
                    📢 {match.statusDetail}
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase pt-1 border-t border-slate-100">
                  <span>{match.venue}</span>
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(match); }}
                      className="text-[#7A1E2D] font-extrabold uppercase hover:underline"
                    >
                      ✏️ Scorer Console
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewingPublicDetailId(match._id); }}
                      className="text-blue-600 font-extrabold uppercase hover:underline"
                    >
                      📊 Detailed Scorecard
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* RENDER DETAILED PUBLIC SCORECARD VIEW */}
      {viewingPublicDetailId && renderPublicScorecard()}

      {/* ADMIN CONTROL PANEL MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">

            <div className="bg-[#7A1E2D] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#F2B84B]">
              <div>
                <h3 className="font-black text-sm md:text-base">
                  {isEditing ? `Scoreboard Panel: ${formSport}` : "Setup Sports Event Match"}
                </h3>
                <p className="text-[10px] text-white/80 font-bold mt-0.5">Parameters settings and lineup configuration</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-white hover:text-[#F2B84B] text-xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-xs md:text-sm flex-grow">

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Sports Event Category</label>
                  <select
                    value={formSport}
                    disabled={isEditing}
                    onChange={(e) => handleSportChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none text-xs"
                  >
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {formSport === "Others" && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Write-in Sport Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Throwball"
                      value={formCustomSport}
                      onChange={(e) => setFormCustomSport(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-bold text-xs"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Tournament Track</label>
                  <input
                    type="text"
                    required
                    value={formTournament}
                    onChange={(e) => setFormTournament(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-bold text-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Match Venue</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Volleyball Court 1"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-3">
                  <div className="pb-1 border-b border-slate-200">
                    <span className="font-extrabold text-[#7A1E2D] uppercase tracking-wider text-xs">Team A (Custom Entry)</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Team Name A</label>
                    <input
                      type="text"
                      list="teams-datalist-a"
                      required
                      placeholder="Type any custom team name..."
                      value={formTeamA}
                      onChange={(e) => setFormTeamA(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-bold text-slate-700 text-xs"
                    />
                    <datalist id="teams-datalist-a">
                      {teams.map(t => <option key={t._id} value={t.name}>{t.department}</option>)}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Captain Name</label>
                    <input
                      type="text"
                      value={formCaptainA}
                      onChange={(e) => setFormCaptainA(e.target.value)}
                      placeholder="Captain A name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-medium text-slate-700 text-xs"
                    />
                  </div>
                  {formSport === "Cricket" && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Wicket Keeper (WK)</label>
                      <input
                        type="text"
                        value={formWkA}
                        onChange={(e) => setFormWkA(e.target.value)}
                        placeholder="Wicket Keeper Team A"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-medium text-slate-700 text-xs"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="pb-1 border-b border-slate-200">
                    <span className="font-extrabold text-[#7A1E2D] uppercase tracking-wider text-xs">Team B (Custom Entry)</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Team Name B</label>
                    <input
                      type="text"
                      list="teams-datalist-b"
                      required
                      placeholder="Type any custom team name..."
                      value={formTeamB}
                      onChange={(e) => setFormTeamB(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-bold text-slate-700 text-xs"
                    />
                    <datalist id="teams-datalist-b">
                      {teams.map(t => <option key={t._id} value={t.name}>{t.department}</option>)}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Captain Name</label>
                    <input
                      type="text"
                      value={formCaptainB}
                      onChange={(e) => setFormCaptainB(e.target.value)}
                      placeholder="Captain B name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-medium text-slate-700 text-xs"
                    />
                  </div>
                  {formSport === "Cricket" && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Wicket Keeper (WK)</label>
                      <input
                        type="text"
                        value={formWkB}
                        onChange={(e) => setFormWkB(e.target.value)}
                        placeholder="Wicket Keeper Team B"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-medium text-slate-700 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Match Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-medium text-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Match Time</label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-medium text-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Timing Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none text-xs"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Event Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none text-xs"
                  >
                    <option value="Mens">Mens</option>
                    <option value="Womens">Womens</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Format Type</label>
                  <select
                    value={formMatchType}
                    onChange={(e) => setFormMatchType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none text-xs"
                  >
                    <option value="T20">T20 (Cricket)</option>
                    <option value="10 Overs">10 Overs</option>
                    <option value="Set Score">Set Score (Volleyball/Badminton)</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              {formStatus === "Live" && (
                <div className="bg-slate-50 border-2 border-[#7A1E2D]/20 rounded-2xl p-6 shadow-sm text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">Live Scoreboard Summary</p>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">{formTeamA || "TEAM A"}</span>
                      {formSport === "Cricket" && (
                        <span className="text-[10px] bg-red-100 text-[#7A1E2D] font-black px-2 py-0.5 rounded uppercase block mb-2 max-w-max mx-auto">
                          {labels.teamABadge}
                        </span>
                      )}
                      <div className="text-4xl font-black text-[#7A1E2D] px-6 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm tracking-tight">
                        {formScoreA || "0"}
                      </div>
                      {formSport === "Cricket" && formScoreA && (
                        <div className="text-[10px] text-slate-400 font-bold mt-1">CRR: {calculateCRRForMatch(formScoreA)}</div>
                      )}
                    </div>
                    
                    <span className="text-xl font-extrabold text-slate-300">VS</span>
                    
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">{formTeamB || "TEAM B"}</span>
                      {formSport === "Cricket" && (
                        <span className="text-[10px] bg-red-100 text-[#7A1E2D] font-black px-2 py-0.5 rounded uppercase block mb-2 max-w-max mx-auto">
                          {labels.teamBBadge}
                        </span>
                      )}
                      <div className="text-4xl font-black text-[#7A1E2D] px-6 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm tracking-tight">
                        {formScoreB || "0"}
                      </div>
                      {formSport === "Cricket" && formScoreB && (
                        <div className="text-[10px] text-slate-400 font-bold mt-1">CRR: {calculateCRRForMatch(formScoreB)}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="pb-1 border-b border-slate-200 flex justify-between items-center">
                  <h4 className="font-extrabold text-xs text-slate-600 uppercase tracking-wider">
                    Squad Lineup Builder ({getRequiredPlayerCount(formSport)} Player Slots Required)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-[#7A1E2D]/5 p-2 rounded-lg">
                      <span className="font-extrabold text-xs text-[#7A1E2D] uppercase">{formTeamA || "Team A"} Lineup</span>
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {formTeamARoster.map((player, index) => (
                        <div key={`roster-A-${index}`} className="flex gap-2 items-center">
                          <span className="text-[9px] font-black text-slate-400 w-5 text-right">{index + 1}.</span>
                          <input
                            type="text"
                            required
                            placeholder="Player Name"
                            value={player.name || ""}
                            onChange={(e) => updatePlayerRow("A", index, "name", e.target.value)}
                            className="flex-grow p-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-700 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Roll No"
                            value={player.rollNo || ""}
                            onChange={(e) => updatePlayerRow("A", index, "rollNo", e.target.value)}
                            className="w-24 p-1.5 border border-slate-200 rounded text-xs font-medium text-slate-500 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-[#7A1E2D]/5 p-2 rounded-lg">
                      <span className="font-extrabold text-xs text-[#7A1E2D] uppercase">{formTeamB || "Team B"} Lineup</span>
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {formTeamBRoster.map((player, index) => (
                        <div key={`roster-B-${index}`} className="flex gap-2 items-center">
                          <span className="text-[9px] font-black text-slate-400 w-5 text-right">{index + 1}.</span>
                          <input
                            type="text"
                            required
                            placeholder="Player Name"
                            value={player.name || ""}
                            onChange={(e) => updatePlayerRow("B", index, "name", e.target.value)}
                            className="flex-grow p-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-700 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Roll No"
                            value={player.rollNo || ""}
                            onChange={(e) => updatePlayerRow("B", index, "rollNo", e.target.value)}
                            className="w-24 p-1.5 border border-slate-200 rounded text-xs font-medium text-slate-500 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {formStatus === "Live" && formSport === "Cricket" && (
                <div className="border border-[#F2B84B] rounded-2xl p-6 bg-[#F2B84B]/5 space-y-6">
                  <div className="border-b border-amber-200 pb-3 flex justify-between items-center">
                    <h4 className="font-black text-xs text-[#7A1E2D] uppercase tracking-wider">Cricket Ball-By-Ball engine</h4>
                    <span className="text-[10px] font-black bg-red-100 text-red-700 px-3 py-1 rounded">
                      Innings: {cricketInnings} {targetRuns ? `• Target: ${targetRuns}` : ""}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Toss Winner</label>
                      <select
                        value={tossWinner}
                        onChange={(e) => setTossWinner(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded text-xs font-bold"
                      >
                        <option value="">Choose team...</option>
                        <option value={formTeamA}>{formTeamA}</option>
                        <option value={formTeamB}>{formTeamB}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Toss Decision</label>
                      <select
                        value={tossDecision}
                        onChange={(e) => setTossDecision(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded text-xs font-bold"
                      >
                        <option value="Bat">Batting First</option>
                        <option value="Bowl">Bowling First</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Max Match Overs</label>
                      <input
                        type="number"
                        value={matchOvers}
                        onChange={(e) => setMatchOvers(parseInt(e.target.value) || 20)}
                        className="w-full p-2 border border-slate-200 rounded text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">★ Striker (Batting Team Only)</label>
                      <select
                        value={striker}
                        onChange={(e) => {
                          const name = e.target.value;
                          setStriker(name);
                          if (name && !batsmenStats[name]) {
                            setBatsmenStats(prev => ({ ...prev, [name]: { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 } }));
                          }
                        }}
                        className="w-full p-2 border border-slate-200 rounded text-xs font-bold text-slate-700 bg-slate-50"
                      >
                        <option value="">Select Striker...</option>
                        {battingRoster.map((p, idx) => p.name && (
                          <option key={`opt-striker-${idx}`} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Non-Striker (Batting Team Only)</label>
                      <select
                        value={nonStriker}
                        onChange={(e) => {
                          const name = e.target.value;
                          setNonStriker(name);
                          if (name && !batsmenStats[name]) {
                            setBatsmenStats(prev => ({ ...prev, [name]: { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 } }));
                          }
                        }}
                        className="w-full p-2 border border-slate-200 rounded text-xs font-bold text-slate-700 bg-slate-50"
                      >
                        <option value="">Select Non-Striker...</option>
                        {battingRoster.map((p, idx) => p.name && (
                          <option key={`opt-nonstriker-${idx}`} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Active Bowler (Bowling Team Only)</label>
                      <select
                        value={currentBowler}
                        onChange={(e) => {
                          const name = e.target.value;
                          setCurrentBowler(name);
                          if (name && !bowlerStats[name]) {
                            setBowlerStats(prev => ({ ...prev, [name]: { oversCount: 0, maidens: 0, runsConceded: 0, wickets: 0, ballsCount: 0, economy: 0 } }));
                          }
                        }}
                        className="w-full p-2 border border-slate-200 rounded text-xs font-bold text-slate-700 bg-slate-50"
                      >
                        <option value="">Select Bowler...</option>
                        {bowlingRoster.map((p, idx) => p.name && (
                          <option key={`opt-bowler-${idx}`} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h5 className="font-black text-[10px] text-[#7A1E2D] uppercase tracking-wider">Batsmen live</h5>
                      <div className="divide-y divide-slate-100 text-xs">
                        {striker && (
                          <div className="py-1 flex justify-between font-extrabold text-slate-800">
                            <span>★ {striker}</span>
                            <span>{getBatsmanStat(striker).runs} ({getBatsmanStat(striker).balls}b) • SR: {getBatsmanStat(striker).strikeRate}</span>
                          </div>
                        )}
                        {nonStriker && (
                          <div className="py-1 flex justify-between text-slate-500 font-bold">
                            <span>{nonStriker}</span>
                            <span>{getBatsmanStat(nonStriker).runs} ({getBatsmanStat(nonStriker).balls}b) • SR: {getBatsmanStat(nonStriker).strikeRate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h5 className="font-black text-[10px] text-[#7A1E2D] uppercase tracking-wider">Bowler live</h5>
                      {currentBowler && (
                        <div className="text-xs divide-y divide-slate-100 font-extrabold">
                          <div className="py-1.5 flex justify-between text-slate-800">
                            <span>{currentBowler}</span>
                            <span>{getBowlerStat(currentBowler).oversCount} Ov • R: {getBowlerStat(currentBowler).runsConceded} • W: {getBowlerStat(currentBowler).wickets}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-400 text-xs">Current Over:</span>
                    <div className="flex gap-1.5">
                      {currentOverBalls.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No balls yet</span>
                      ) : (
                        currentOverBalls.map((ball, idx) => (
                          <span key={idx} className="bg-slate-100 text-[#7A1E2D] font-black px-2 py-0.5 rounded text-xs border border-slate-200">
                            {ball}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <button type="button" onClick={() => handleCricketBall(0)} className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg text-xs">Dot Ball</button>
                    <button type="button" onClick={() => handleCricketBall(1)} className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg text-xs">1 Run</button>
                    <button type="button" onClick={() => handleCricketBall(2)} className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg text-xs">2 Runs</button>
                    <button type="button" onClick={() => handleCricketBall(3)} className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg text-xs">3 Runs</button>
                    <button type="button" onClick={() => handleCricketBall(4)} className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-lg text-xs">4 Boundary</button>
                    <button type="button" onClick={() => handleCricketBall(6)} className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-lg text-xs">6 Sixer</button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                    <button type="button" onClick={() => handleCricketBall(1, true, "Wide")} className="py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-lg text-xs">Wide (+1)</button>
                    <button type="button" onClick={() => handleCricketBall(1, true, "NoBall")} className="py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-lg text-xs">No Ball (+1)</button>
                    <button type="button" onClick={() => handleCricketBall(1, true, "Bye")} className="py-2 bg-slate-500 hover:bg-slate-600 text-white font-extrabold rounded-lg text-xs">Bye</button>
                    <button type="button" onClick={handleUndo} className="py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black rounded-lg text-xs">↩ Undo</button>
                    <button type="button" onClick={handleRedo} className="py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black rounded-lg text-xs">↪ Redo</button>
                  </div>
                  <button type="button" onClick={() => handleCricketBall(0, false, "", true)} className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-lg text-xs">⚠️ OUT / WICKET</button>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold rounded-xl transition-all shadow-sm"
                >
                  {isEditing ? "Save Configuration" : "Conduct Match"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DISMISSAL POPUP MODAL */}
      {wicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-[#7A1E2D] text-sm uppercase tracking-wide">
              Confirm Out & Insert Replacement
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Dismissed Batsman (Crease Only)</label>
                <select
                  value={pendingDismissedBatsman}
                  onChange={(e) => setPendingDismissedBatsman(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded font-bold text-slate-700 bg-white"
                >
                  <option value="">Select dismissed player...</option>
                  {striker && <option value={striker}>★ Striker: {striker}</option>}
                  {nonStriker && <option value={nonStriker}>Non-Striker: {nonStriker}</option>}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dismissal Type Mode</label>
                <select
                  value={pendingWicketType}
                  onChange={(e) => setPendingWicketType(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded font-bold text-slate-700 bg-white"
                >
                  <option value="Bowled">Bowled</option>
                  <option value="Caught">Caught Out</option>
                  <option value="LBW">LBW</option>
                  <option value="RunOut">Run Out</option>
                  <option value="Stumped">Stumped</option>
                  <option value="HitWicket">Hit Wicket</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Incoming Replacement Batsman</label>
                <select
                  id="new-batsman-select-crease"
                  className="w-full p-2 border border-slate-200 rounded font-bold text-slate-700 bg-white animate-pulse"
                >
                  <option value="">Choose new batsman from team rosters...</option>
                  {battingRoster.map((p, idx) => {
                    if (p.name && p.name !== striker && p.name !== nonStriker) {
                      return <option key={`opt-rep-${idx}`} value={p.name}>{p.name}</option>;
                    }
                    return null;
                  })}
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-3">
              <button
                type="button"
                onClick={() => setWicketModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const selector = document.getElementById("new-batsman-select-crease");
                  confirmWicketDismissal(selector?.value, pendingDismissedBatsman);
                }}
                className="px-5 py-2 bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold rounded-lg text-xs"
              >
                Confirm Wicket Flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOWLER OVER END DIALOG */}
      {bowlerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-[#7A1E2D] text-sm uppercase tracking-wide">
              Choose Next Bowler
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Incoming Bowler</label>
                <select
                  id="new-bowler-select-over"
                  className="w-full p-2 border border-slate-200 rounded font-bold text-slate-700 bg-white"
                >
                  <option value="">Choose next bowler...</option>
                  {bowlingRoster.map((p, idx) => {
                    if (p.name && p.name !== currentBowler) {
                      return <option key={`opt-nextbowl-${idx}`} value={p.name}>{p.name}</option>;
                    }
                    return null;
                  })}
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-3">
              <button
                type="button"
                onClick={() => {
                  const selector = document.getElementById("new-bowler-select-over");
                  const name = selector?.value;
                  if (name) {
                    setCurrentBowler(name);
                    if (!bowlerStats[name]) {
                      setBowlerStats(prev => ({
                        ...prev,
                        [name]: { oversCount: 0, maidens: 0, runsConceded: 0, wickets: 0, ballsCount: 0, economy: 0 }
                      }));
                    }
                  }
                  setBowlerModalOpen(false);
                }}
                className="px-5 py-2 bg-[#7A1E2D] text-white font-bold rounded-lg text-xs"
              >
                Assign Bowler
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}