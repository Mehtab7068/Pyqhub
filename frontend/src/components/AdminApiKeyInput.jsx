import React from 'react';

const AdminApiKeyInput = ({ apiKey, onSave }) => {
    return (
        <div className="glass-card p-5">
            <label className="block text-sm font-medium text-slate-300 mb-1">Admin API Key</label>
            <input
                type="password"
                value={apiKey}
                onChange={(e) => onSave(e.target.value)}
                placeholder="Enter admin API key"
                className="input-dark"
            />
        </div>
    );
};

export default AdminApiKeyInput;