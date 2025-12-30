import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { visitBin, openBin, closeBin } from "../services/binApi";
import "./Dashboard.css";

function Dashboard() {
    const params = useParams();
    const binId = params.binId || "BIN_01";

    const [user, setUser] = useState(null);
    const [bin, setBin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    // -------- helper: normalize backend response --------
    function normalizeResponse(data) {
        const resolvedUser =
            data.user ||
            data?.data?.user ||
            (data.displayName ? data : null);

        const resolvedBin =
            data.bin ||
            data?.data?.bin ||
            (data.status ? data : null);

        return { resolvedUser, resolvedBin };
    }
    // ---------------------------------------------------

    useEffect(() => {
        async function loadDashboard() {
            try {
                let storedUserId = localStorage.getItem("userId");

                if (storedUserId === "null" || storedUserId === "undefined") {
                    storedUserId = null;
                }

                const data = await visitBin(binId, storedUserId);
                const { resolvedUser, resolvedBin } = normalizeResponse(data);

                if (resolvedUser?._id) {
                    localStorage.setItem("userId", resolvedUser._id);
                }

                setUser(resolvedUser);
                setBin(resolvedBin);
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

            const userId = localStorage.getItem("userId");
            await openBin(binId, userId);

            const data = await visitBin(binId, userId);
            const { resolvedUser, resolvedBin } = normalizeResponse(data);

            if (resolvedUser?._id) {
                localStorage.setItem("userId", resolvedUser._id);
            }

            setUser(resolvedUser);
            setBin(resolvedBin);
        } catch {
            setError("Please wait before trying again");
        } finally {
            setActionLoading(false);
        }
    }


    async function handleClose() {
        try {
            setActionLoading(true);

            const userId = localStorage.getItem("userId");
            await closeBin(binId, userId);

            const data = await visitBin(binId, userId);
            const { resolvedUser, resolvedBin } = normalizeResponse(data);

            if (resolvedUser?._id) {
                localStorage.setItem("userId", resolvedUser._id);
            }

            setUser(resolvedUser);
            setBin(resolvedBin);
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
                        <div className="value">
                            {user?.displayName || "Guest"}
                        </div>

                        <div className="label mt">Points Earned</div>
                        <div className="value">
                            {user?.points ?? 0}
                        </div>
                    </div>

                    <div className="card">
                        <div className="label">Bin Status</div>
                        <div className={`status ${bin?.status || ""}`}>
                            {bin?.status || "loading..."}
                        </div>

                        <div className="label mt">Fill Level</div>
                        <div className="value">{bin?.level ?? 0}%</div>
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
        </div>
    );
}

export default Dashboard;
