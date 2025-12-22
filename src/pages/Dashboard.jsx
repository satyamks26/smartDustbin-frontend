import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { visitBin, openBin, closeBin } from "../services/binApi";
import "./Dashboard.css";

function Dashboard() {
    const params = useParams();
    const binId = params.binId || "1";

    const [user, setUser] = useState(null);
    const [bin, setBin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const storedUserId = localStorage.getItem("userId");
                const data = await visitBin(binId, storedUserId);

                if (!storedUserId) {
                    localStorage.setItem("userId", data.user.id);
                }

                setUser(data.user);
                setBin(data.bin);
                setLoading(false);
            } catch (err) {
                setError("Failed to load dashboard");
                setLoading(false);
            }
        }

        loadDashboard();
    }, [binId]);

    async function handleOpen() {
        try {
            setActionLoading(true);
            await openBin(binId);

            const storedUserId = localStorage.getItem("userId");
            const data = await visitBin(binId, storedUserId);
            setBin(data.bin);
        } catch {
            setError("Please wait before trying again");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleClose() {
        try {
            setActionLoading(true);
            await closeBin(binId);

            const storedUserId = localStorage.getItem("userId");
            const data = await visitBin(binId, storedUserId);
            setBin(data.bin);
        } catch {
            setError("Please wait before trying again");
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) {
        return <p style={{ padding: "24px" }}>Loading dashboard...</p>;
    }

    return (
        <div className="dashboard">
            <div className="app-container">
                <h2>🌿 Smart Dustbin Dashboard</h2>

                {error && <p className="error">{error}</p>}

                <div className="grid">
                    <div className="card">
                        <div className="label">User</div>
                        <div className="value">{user.name}</div>

                        <div className="label mt">Points Earned</div>
                        <div className="value">{user.points}</div>
                    </div>

                    <div className="card">
                        <div className="label">Bin Status</div>
                        <div className={`status ${bin.status}`}>
                            {bin.status}
                        </div>

                        <div className="label mt">Fill Level</div>
                        <div className="value">{bin.level}%</div>
                    </div>
                </div>

                <div className="buttons">
                    <button
                        className="open"
                        onClick={handleOpen}
                        disabled={actionLoading}
                    >
                        Open Bin
                    </button>

                    <button
                        className="close"
                        onClick={handleClose}
                        disabled={actionLoading}
                    >
                        Close Bin
                    </button>
                </div>

                <div className="footer-note">
                    Scan the QR on the dustbin to earn points and keep the environment clean ♻️
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
