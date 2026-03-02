"""
Five Custlass — главный API для управления данными сайта (игроки, матчи, новости, достижения, о клубе).
Поддерживает GET (публичный) и POST/PUT/DELETE (с токеном X-Admin-Token).
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "fivecustlass2024")
DSN = os.environ.get("DATABASE_URL")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}

def get_conn():
    return psycopg2.connect(DSN, cursor_factory=RealDictCursor)

def is_admin(event):
    headers = event.get("headers") or {}
    token = headers.get("X-Admin-Token") or headers.get("x-admin-token") or ""
    return token == ADMIN_TOKEN

def resp(status, body):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(body, default=str, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # /api/players
    if path.endswith("/players"):
        conn = get_conn()
        cur = conn.cursor()
        if method == "GET":
            cur.execute("SELECT * FROM players WHERE active=true ORDER BY sort_order")
            rows = list(cur.fetchall())
            conn.close()
            return resp(200, rows)
        if not is_admin(event):
            conn.close()
            return resp(403, {"error": "Forbidden"})
        if method == "POST":
            cur.execute("""INSERT INTO players (nickname,real_name,role,country,hltv_rating,photo_url,bio,kills_per_round,headshot_pct,maps_played,sort_order)
                VALUES (%(nickname)s,%(real_name)s,%(role)s,%(country)s,%(hltv_rating)s,%(photo_url)s,%(bio)s,%(kills_per_round)s,%(headshot_pct)s,%(maps_played)s,%(sort_order)s)
                RETURNING *""", body)
            row = cur.fetchone()
            conn.commit(); conn.close()
            return resp(201, dict(row))

    # /api/players/{id}
    if "/players/" in path:
        pid = path.split("/players/")[-1].strip("/")
        conn = get_conn(); cur = conn.cursor()
        if not is_admin(event):
            conn.close()
            return resp(403, {"error": "Forbidden"})
        if method == "PUT":
            cur.execute("""UPDATE players SET nickname=%(nickname)s,real_name=%(real_name)s,role=%(role)s,
                country=%(country)s,hltv_rating=%(hltv_rating)s,photo_url=%(photo_url)s,bio=%(bio)s,
                kills_per_round=%(kills_per_round)s,headshot_pct=%(headshot_pct)s,maps_played=%(maps_played)s,
                active=%(active)s,sort_order=%(sort_order)s WHERE id=%s RETURNING *""",
                {**body, "id": pid} if False else (*[body], pid)[1:])
            # safer:
            cur.execute("""UPDATE players SET nickname=%s,real_name=%s,role=%s,country=%s,hltv_rating=%s,
                photo_url=%s,bio=%s,kills_per_round=%s,headshot_pct=%s,maps_played=%s,active=%s,sort_order=%s
                WHERE id=%s RETURNING *""",
                (body.get("nickname"), body.get("real_name"), body.get("role"), body.get("country"),
                 body.get("hltv_rating"), body.get("photo_url"), body.get("bio"),
                 body.get("kills_per_round"), body.get("headshot_pct"), body.get("maps_played"),
                 body.get("active", True), body.get("sort_order", 0), pid))
            row = cur.fetchone()
            conn.commit(); conn.close()
            return resp(200, dict(row) if row else {"error": "not found"})
        if method == "DELETE":
            cur.execute("UPDATE players SET active=false WHERE id=%s", (pid,))
            conn.commit(); conn.close()
            return resp(200, {"ok": True})

    # /api/matches
    if path.endswith("/matches"):
        conn = get_conn(); cur = conn.cursor()
        if method == "GET":
            cur.execute("SELECT * FROM matches ORDER BY match_date DESC NULLS LAST")
            rows = list(cur.fetchall())
            conn.close()
            return resp(200, rows)
        if not is_admin(event):
            conn.close()
            return resp(403, {"error": "Forbidden"})
        if method == "POST":
            cur.execute("""INSERT INTO matches (opponent,event,match_date,score_us,score_them,map,result,stream_url)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *""",
                (body.get("opponent"), body.get("event"), body.get("match_date"),
                 body.get("score_us"), body.get("score_them"), body.get("map",""),
                 body.get("result","upcoming"), body.get("stream_url","")))
            row = cur.fetchone()
            conn.commit(); conn.close()
            return resp(201, dict(row))

    if "/matches/" in path:
        mid = path.split("/matches/")[-1].strip("/")
        conn = get_conn(); cur = conn.cursor()
        if not is_admin(event):
            conn.close()
            return resp(403, {"error": "Forbidden"})
        if method == "PUT":
            cur.execute("""UPDATE matches SET opponent=%s,event=%s,match_date=%s,score_us=%s,score_them=%s,
                map=%s,result=%s,stream_url=%s WHERE id=%s RETURNING *""",
                (body.get("opponent"), body.get("event"), body.get("match_date"),
                 body.get("score_us"), body.get("score_them"), body.get("map",""),
                 body.get("result","upcoming"), body.get("stream_url",""), mid))
            row = cur.fetchone()
            conn.commit(); conn.close()
            return resp(200, dict(row) if row else {"error": "not found"})
        if method == "DELETE":
            cur.execute("DELETE FROM matches WHERE id=%s", (mid,))
            conn.commit(); conn.close()
            return resp(200, {"ok": True})

    # /api/news
    if path.endswith("/news"):
        conn = get_conn(); cur = conn.cursor()
        if method == "GET":
            cur.execute("SELECT * FROM news WHERE published=true ORDER BY created_at DESC")
            rows = list(cur.fetchall())
            conn.close()
            return resp(200, rows)
        if not is_admin(event):
            conn.close()
            return resp(403, {"error": "Forbidden"})
        if method == "POST":
            cur.execute("""INSERT INTO news (title,content,image_url,published)
                VALUES (%s,%s,%s,%s) RETURNING *""",
                (body.get("title"), body.get("content",""), body.get("image_url",""), body.get("published",True)))
            row = cur.fetchone()
            conn.commit(); conn.close()
            return resp(201, dict(row))

    if "/news/" in path:
        nid = path.split("/news/")[-1].strip("/")
        conn = get_conn(); cur = conn.cursor()
        if not is_admin(event):
            conn.close()
            return resp(403, {"error": "Forbidden"})
        if method == "PUT":
            cur.execute("""UPDATE news SET title=%s,content=%s,image_url=%s,published=%s WHERE id=%s RETURNING *""",
                (body.get("title"), body.get("content",""), body.get("image_url",""), body.get("published",True), nid))
            row = cur.fetchone()
            conn.commit(); conn.close()
            return resp(200, dict(row) if row else {"error": "not found"})
        if method == "DELETE":
            cur.execute("DELETE FROM news WHERE id=%s", (nid,))
            conn.commit(); conn.close()
            return resp(200, {"ok": True})

    # /api/achievements
    if path.endswith("/achievements"):
        conn = get_conn(); cur = conn.cursor()
        if method == "GET":
            cur.execute("SELECT * FROM achievements ORDER BY year DESC, id DESC")
            rows = list(cur.fetchall())
            conn.close()
            return resp(200, rows)
        if not is_admin(event):
            conn.close()
            return resp(403, {"error": "Forbidden"})
        if method == "POST":
            cur.execute("""INSERT INTO achievements (title,event,place,year,prize)
                VALUES (%s,%s,%s,%s,%s) RETURNING *""",
                (body.get("title"), body.get("event",""), body.get("place","1st"),
                 body.get("year", 2024), body.get("prize","")))
            row = cur.fetchone()
            conn.commit(); conn.close()
            return resp(201, dict(row))

    if "/achievements/" in path:
        aid = path.split("/achievements/")[-1].strip("/")
        conn = get_conn(); cur = conn.cursor()
        if not is_admin(event):
            conn.close()
            return resp(403, {"error": "Forbidden"})
        if method == "PUT":
            cur.execute("""UPDATE achievements SET title=%s,event=%s,place=%s,year=%s,prize=%s WHERE id=%s RETURNING *""",
                (body.get("title"), body.get("event",""), body.get("place","1st"), body.get("year",2024), body.get("prize",""), aid))
            row = cur.fetchone()
            conn.commit(); conn.close()
            return resp(200, dict(row) if row else {"error": "not found"})
        if method == "DELETE":
            cur.execute("DELETE FROM achievements WHERE id=%s", (aid,))
            conn.commit(); conn.close()
            return resp(200, {"ok": True})

    # /api/club
    if path.endswith("/club"):
        conn = get_conn(); cur = conn.cursor()
        if method == "GET":
            cur.execute("SELECT * FROM club_info LIMIT 1")
            row = cur.fetchone()
            conn.close()
            return resp(200, dict(row) if row else {})
        if not is_admin(event):
            conn.close()
            return resp(403, {"error": "Forbidden"})
        if method == "PUT":
            cur.execute("""UPDATE club_info SET title=%s,description=%s,founded=%s,country=%s,updated_at=NOW()
                WHERE id=1 RETURNING *""",
                (body.get("title"), body.get("description"), body.get("founded"), body.get("country")))
            row = cur.fetchone()
            conn.commit(); conn.close()
            return resp(200, dict(row) if row else {"error": "not found"})

    return resp(404, {"error": "Not found"})
