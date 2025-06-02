import React from 'react';
import '../styles/Dashboard.css';

// Icons
import { FaUser, FaChartBar, FaClipboardList, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { IoCarSport } from 'react-icons/io5';
import { GiRaceCar } from 'react-icons/gi';
import { MdTimer } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logout-button">
          <button onClick={onLogout}>
            <FaSignOutAlt /> Exit
          </button>
        </div>

        <div className="admin-profile">
          <div className="avatar">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Admin" />
          </div>
          <h2>Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="active"><FaChartBar /> Summary</li>
            <li><FaClipboardList /> Records</li>
            <li><FaClipboardList /> Reports</li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Summary</h1>

        {/* Chart */}
        <div className="chart-container">
          {/* This is a placeholder for the chart */}
          <div className="chart-placeholder">
            {Array.from({ length: 24 }).map((_, index) => (
              <div 
                key={index} 
                className="chart-bar" 
                style={{ 
                  height: `${Math.random() * 80 + 20}px`,
                  backgroundColor: index === 18 ? '#4285f4' : '#e0e8ff'
                }}
              />
            ))}
          </div>
        </div>

        {/* Accordion sections */}
        <div className="accordion-section">
          <div className="accordion-header">
            <h2>Races in 2025</h2>
            <FaChevronDown />
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Race</th>
                  <th>Laps</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="race-info">
                      <div className="icon race-icon">
                        <GiRaceCar />
                      </div>
                      <span>Makonha Race</span>
                    </div>
                  </td>
                  <td>15</td>
                  <td>1:23:45</td>
                </tr>
                <tr>
                  <td>
                    <div className="race-info">
                      <div className="icon race-icon">
                        <GiRaceCar />
                      </div>
                      <span>Pamonha Race</span>
                    </div>
                  </td>
                  <td>69</td>
                  <td>4:20:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="accordion-section">
          <div className="accordion-header">
            <h2>Teams in 2025</h2>
            <FaChevronDown />
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="team-info">
                      <div className="icon team-icon">
                        <IoCarSport />
                      </div>
                      <span>Tronca Verde</span>
                    </div>
                  </td>
                  <td>100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="accordion-section">
          <div className="accordion-header">
            <h2>Drivers in 2025</h2>
            <FaChevronDown />
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="driver-info">
                      <div className="icon driver-icon">
                        <FaUser />
                      </div>
                      <span>Seu Makonha</span>
                    </div>
                  </td>
                  <td>420</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary sidebar */}
      <div className="summary-sidebar">
        <div className="summary-header">
          <h2>Total</h2>
          <BsThreeDotsVertical />
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="icon driver-icon">
              <FaUser />
            </div>
            <div className="summary-content">
              <h3>Drivers</h3>
              <p>10</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon team-icon">
              <IoCarSport />
            </div>
            <div className="summary-content">
              <h3>Teams</h3>
              <p>50</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon season-icon">
              <MdTimer />
            </div>
            <div className="summary-content">
              <h3>Seasons</h3>
              <p>100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 