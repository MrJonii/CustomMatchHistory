import './LeaderboardEntry.css'

const LeaderboardEntry = ( {entry, index} ) => {
    return <div className="leaderboardEntry">
        <p style={{width: '200px'}}>{index + 1}. {entry.summonerName}</p>
        <p>{entry.perGame.toFixed(2)}</p>
        <p>{entry.stat}</p>
        <p>{entry.perMinute.toFixed(2)}</p>
        <p>{entry.teamShare.toFixed(2)}%</p>
    </div>
};

export default LeaderboardEntry;