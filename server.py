import http.server
import socketserver
import json
import urllib.parse
import os
import sqlite3
import datetime
import random

PORT = 8000
DB_FILE = 'prbit.db'

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    
    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            name TEXT,
            avatar_url TEXT,
            total_score INTEGER DEFAULT 0,
            grade TEXT DEFAULT 'D',
            streak INTEGER DEFAULT 1,
            join_leaderboard INTEGER DEFAULT 0,
            skill TEXT DEFAULT 'JavaScript',
            prs_opened INTEGER DEFAULT 0,
            prs_merged INTEGER DEFAULT 0,
            total_seconds INTEGER DEFAULT 0,
            rank_change INTEGER DEFAULT 0,
            is_demo INTEGER DEFAULT 0,
            last_active_date TEXT,
            created_at TEXT
        )
    ''')

    # Quests table
    c.execute('''
        CREATE TABLE IF NOT EXISTS quests (
            id TEXT PRIMARY KEY,
            username TEXT,
            issue_id INTEGER,
            issue_title TEXT,
            repo_name TEXT,
            issue_url TEXT,
            difficulty TEXT DEFAULT 'easy',
            status TEXT DEFAULT 'in_progress',
            active_seconds INTEGER DEFAULT 0,
            milestones_json TEXT,
            points INTEGER DEFAULT 0,
            grade TEXT DEFAULT 'D',
            pr_opened_url TEXT,
            pr_opened_verified INTEGER DEFAULT 0,
            pr_merged_url TEXT,
            pr_merged_verified INTEGER DEFAULT 0,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY (username) REFERENCES users (username)
        )
    ''')

    # Private Leagues table
    c.execute('''
        CREATE TABLE IF NOT EXISTS leagues (
            code TEXT PRIMARY KEY,
            name TEXT,
            owner_username TEXT,
            created_at TEXT
        )
    ''')

    # League Members table
    c.execute('''
        CREATE TABLE IF NOT EXISTS league_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            league_code TEXT,
            username TEXT,
            joined_at TEXT,
            UNIQUE(league_code, username)
        )
    ''')

    conn.commit()

    # Seed 10 Demo Players if not already seeded
    c.execute('SELECT COUNT(*) as count FROM users WHERE is_demo = 1')
    demo_count = c.fetchone()['count']
    if demo_count < 10:
        demo_players = [
            ("astro_nova", "Nova Vance", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", 520, "S", 8, 1, "JavaScript", 6, 4, 66600, 1),
            ("quantum_coder", "Alex Rivera", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80", 440, "S", 6, 1, "TypeScript", 5, 3, 51120, 0),
            ("nebula_dev", "Elena Rostova", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", 360, "A", 5, 1, "Python", 4, 3, 39600, 2),
            ("cosmic_byte", "Liam Chen", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", 290, "A", 4, 1, "React", 3, 2, 30600, -1),
            ("stellar_pilot", "Zara Kim", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80", 220, "A", 3, 1, "JavaScript", 3, 1, 25200, 1),
            ("orbit_rider", "Marcus Bell", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80", 180, "B", 3, 1, "HTML/CSS", 2, 1, 19800, 0),
            ("sol_voyager", "Maya Patel", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80", 140, "B", 2, 1, "Python", 2, 1, 14400, -1),
            ("pulsar_cadet", "David O'Connor", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80", 110, "B", 2, 1, "Java", 1, 1, 11520, 2),
            ("comet_builder", "Aisha Al-Mansoor", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80", 85, "C", 1, 1, "TypeScript", 1, 0, 10080, 0),
            ("lunar_rookie", "Taro Tanaka", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", 60, "C", 1, 1, "C++", 1, 0, 7200, -1)
        ]
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        for u in demo_players:
            c.execute('''
                INSERT OR REPLACE INTO users (
                    username, name, avatar_url, total_score, grade, streak, join_leaderboard,
                    skill, prs_opened, prs_merged, total_seconds, rank_change, is_demo, last_active_date, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
            ''', (u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], u[8], u[9], u[10], u[11], now, now))
        
        # Seed a sample league
        c.execute('''
            INSERT OR REPLACE INTO leagues (code, name, owner_username, created_at)
            VALUES (?, ?, ?, ?)
        ''', ('COSMIC-FIRST', 'FirstPR Vanguard League', 'astro_nova', now))
        for u in demo_players[:5]:
            c.execute('''
                INSERT OR IGNORE INTO league_members (league_code, username, joined_at)
                VALUES (?, ?, ?)
            ''', ('COSMIC-FIRST', u[0], now))
            
        conn.commit()
    conn.close()

def calculate_grade(points):
    if points >= 400: return 'S'
    if points >= 200: return 'A'
    if points >= 100: return 'B'
    if points >= 50: return 'C'
    return 'D'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local API access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        if path.startswith('/api/'):
            self.handle_api_get(path, params)
        else:
            # Serve regular static files
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/'):
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len) if content_len > 0 else b'{}'
            try:
                data = json.loads(post_body.decode('utf-8'))
            except Exception:
                data = {}
            self.handle_api_post(path, data)
        else:
            self.send_error(404, "Not Found")

    def send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def handle_api_get(self, path, params):
        conn = get_db()
        c = conn.cursor()

        if path == '/api/user':
            username = params.get('username', [''])[0].strip()
            if not username:
                conn.close()
                self.send_json({"error": "Username required"}, 400)
                return
            c.execute('SELECT * FROM users WHERE username = ?', (username,))
            row = c.fetchone()
            conn.close()
            if row:
                self.send_json(dict(row))
            else:
                self.send_json({"username": username, "total_score": 0, "grade": "D", "streak": 1, "join_leaderboard": 0, "is_new": True})

        elif path == '/api/quests':
            username = params.get('username', [''])[0].strip()
            if not username:
                conn.close()
                self.send_json({"error": "Username required"}, 400)
                return
            c.execute('SELECT * FROM quests WHERE username = ? ORDER BY created_at DESC', (username,))
            rows = [dict(r) for r in c.fetchall()]
            conn.close()
            self.send_json(rows)

        elif path == '/api/leaderboard':
            timeframe = params.get('timeframe', ['all'])[0]
            skill_filter = params.get('skill', ['all'])[0]
            league_code = params.get('league', [''])[0]

            query = '''
                SELECT username, name, avatar_url, total_score, grade, streak, prs_opened, prs_merged,
                       total_seconds, rank_change, is_demo, skill
                FROM users
                WHERE join_leaderboard = 1
            '''
            query_params = []

            if league_code:
                query += ' AND username IN (SELECT username FROM league_members WHERE league_code = ?)'
                query_params.append(league_code)

            if skill_filter and skill_filter.lower() != 'all':
                query += ' AND LOWER(skill) = LOWER(?)'
                query_params.append(skill_filter)

            query += ' ORDER BY total_score DESC, prs_merged DESC, prs_opened DESC'

            c.execute(query, query_params)
            rows = [dict(r) for r in c.fetchall()]
            conn.close()

            # Assign dynamic ranks
            for idx, r in enumerate(rows, 1):
                r['rank'] = idx
                r['hours'] = round(r.get('total_seconds', 0) / 3600, 1)

            self.send_json({
                "timeframe": timeframe,
                "skill": skill_filter,
                "league": league_code,
                "leaderboard": rows
            })

        elif path == '/api/leagues':
            username = params.get('username', [''])[0].strip()
            c.execute('''
                SELECT l.code, l.name, l.owner_username, l.created_at,
                       (SELECT COUNT(*) FROM league_members WHERE league_code = l.code) as member_count
                FROM leagues l
                JOIN league_members m ON l.code = m.league_code
                WHERE m.username = ?
            ''', (username,))
            rows = [dict(r) for r in c.fetchall()]
            conn.close()
            self.send_json(rows)

        else:
            conn.close()
            self.send_json({"error": "Endpoint not found"}, 404)

    def handle_api_post(self, path, data):
        conn = get_db()
        c = conn.cursor()
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        if path == '/api/user':
            username = data.get('username', '').strip()
            if not username:
                conn.close()
                self.send_json({"error": "Username required"}, 400)
                return

            c.execute('SELECT * FROM users WHERE username = ?', (username,))
            existing = c.fetchone()

            name = data.get('name', existing['name'] if existing else username)
            avatar_url = data.get('avatar_url', existing['avatar_url'] if existing else '')
            total_score = data.get('total_score', existing['total_score'] if existing else 0)
            grade = calculate_grade(total_score)
            streak = data.get('streak', existing['streak'] if existing else 1)
            join_leaderboard = data.get('join_leaderboard', existing['join_leaderboard'] if existing else 0)
            skill = data.get('skill', existing['skill'] if existing else 'JavaScript')
            prs_opened = data.get('prs_opened', existing['prs_opened'] if existing else 0)
            prs_merged = data.get('prs_merged', existing['prs_merged'] if existing else 0)
            total_seconds = data.get('total_seconds', existing['total_seconds'] if existing else 0)
            rank_change = data.get('rank_change', existing['rank_change'] if existing else 0)

            c.execute('''
                INSERT OR REPLACE INTO users (
                    username, name, avatar_url, total_score, grade, streak, join_leaderboard,
                    skill, prs_opened, prs_merged, total_seconds, rank_change, is_demo, last_active_date, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, COALESCE((SELECT created_at FROM users WHERE username = ?), ?))
            ''', (username, name, avatar_url, total_score, grade, streak, join_leaderboard, skill, prs_opened, prs_merged, total_seconds, rank_change, now, username, now))

            conn.commit()
            conn.close()
            self.send_json({"success": True, "username": username, "total_score": total_score, "grade": grade, "join_leaderboard": join_leaderboard})

        elif path == '/api/quest':
            qid = data.get('id', '').strip()
            username = data.get('username', '').strip()
            if not qid or not username:
                conn.close()
                self.send_json({"error": "Quest ID and username required"}, 400)
                return

            issue_id = data.get('issue_id', 0)
            issue_title = data.get('issue_title', '')
            repo_name = data.get('repo_name', '')
            issue_url = data.get('issue_url', '')
            difficulty = data.get('difficulty', 'easy')
            status = data.get('status', 'in_progress')
            active_seconds = data.get('active_seconds', 0)
            milestones_json = json.dumps(data.get('milestones', {}))
            points = data.get('points', 0)
            grade = calculate_grade(points)
            pr_opened_url = data.get('pr_opened_url', '')
            pr_opened_verified = 1 if data.get('pr_opened_verified') else 0
            pr_merged_url = data.get('pr_merged_url', '')
            pr_merged_verified = 1 if data.get('pr_merged_verified') else 0

            c.execute('''
                INSERT OR REPLACE INTO quests (
                    id, username, issue_id, issue_title, repo_name, issue_url, difficulty,
                    status, active_seconds, milestones_json, points, grade,
                    pr_opened_url, pr_opened_verified, pr_merged_url, pr_merged_verified,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM quests WHERE id = ?), ?), ?)
            ''', (qid, username, issue_id, issue_title, repo_name, issue_url, difficulty,
                  status, active_seconds, milestones_json, points, grade,
                  pr_opened_url, pr_opened_verified, pr_merged_url, pr_merged_verified,
                  qid, now, now))

            # Recalculate user total score, prs count, total seconds
            c.execute('SELECT SUM(points) as s, SUM(active_seconds) as secs, SUM(pr_opened_verified) as opened, SUM(pr_merged_verified) as merged FROM quests WHERE username = ?', (username,))
            q_stats = c.fetchone()
            new_score = q_stats['s'] or 0
            new_secs = q_stats['secs'] or 0
            new_prs_opened = q_stats['opened'] or 0
            new_prs_merged = q_stats['merged'] or 0
            new_grade = calculate_grade(new_score)

            # Ensure user exists before updating
            c.execute('INSERT OR IGNORE INTO users (username, created_at) VALUES (?, ?)', (username, now))

            c.execute('''
                UPDATE users SET 
                    total_score = ?,
                    grade = ?,
                    prs_opened = ?,
                    prs_merged = ?,
                    total_seconds = ?,
                    last_active_date = ?
                WHERE username = ?
            ''', (new_score, new_grade, new_prs_opened, new_prs_merged, new_secs, now, username))

            conn.commit()
            conn.close()
            self.send_json({"success": True, "quest_id": qid, "points": points, "user_score": new_score, "user_grade": new_grade})

        elif path == '/api/leagues':
            name = data.get('name', '').strip()
            username = data.get('username', '').strip()
            if not name or not username:
                conn.close()
                self.send_json({"error": "League name and username required"}, 400)
                return

            code = 'GALAXY-' + str(random.randint(100, 999))
            c.execute('INSERT INTO leagues (code, name, owner_username, created_at) VALUES (?, ?, ?, ?)', (code, name, username, now))
            c.execute('INSERT INTO league_members (league_code, username, joined_at) VALUES (?, ?, ?)', (code, username, now))
            conn.commit()
            conn.close()
            self.send_json({"success": True, "code": code, "name": name})

        elif path == '/api/leagues/join':
            code = data.get('code', '').strip().upper()
            username = data.get('username', '').strip()
            if not code or not username:
                conn.close()
                self.send_json({"error": "Join code and username required"}, 400)
                return

            c.execute('SELECT * FROM leagues WHERE code = ?', (code,))
            league = c.fetchone()
            if not league:
                conn.close()
                self.send_json({"error": "League with code " + code + " not found"}, 404)
                return

            c.execute('INSERT OR IGNORE INTO league_members (league_code, username, joined_at) VALUES (?, ?, ?)', (code, username, now))
            conn.commit()
            conn.close()
            self.send_json({"success": True, "code": code, "name": league['name']})

        else:
            conn.close()
            self.send_json({"error": "Endpoint not found"}, 404)

if __name__ == '__main__':
    init_db()
    print(f"Starting FirstPR Quest Server on port {PORT} with SQLite database '{DB_FILE}'...")
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        httpd.serve_forever()
