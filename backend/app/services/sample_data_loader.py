import hashlib
import json
import uuid
from datetime import datetime
from app.database import get_db
from app.services.extractor import chunk_text_into_passages
from app.services.vector_store import vector_store

SAMPLE_MEMORIES = [
    {
        "id": "mem-sample-01",
        "title": "The Autumn Lantern Walk along the River",
        "source_type": "story",
        "event_date": "1952-10-15",
        "date_precision": "exact",
        "tags": ["festival", "river", "autumn", "family-tradition"],
        "description": "A written family recollection of the annual harvest lantern walk along the riverbanks of Oakhaven in the autumn of 1952.",
        "text": """In the autumn of 1952, grandfather took all of us down to the river for the annual lantern festival. 
The water was glassy and reflected hundreds of amber paper lanterns drifting toward the bay. 
Aunt Clara brought warm spiced apple buns wrapped in checkered linen. We walked hand-in-hand along the cobblestones 
until the clock struck nine, when the brass band played by the boathouse."""
    },
    {
        "id": "mem-sample-02",
        "title": "Letter from Florence to Arthur",
        "source_type": "letter",
        "event_date": "1944-03-14",
        "date_precision": "exact",
        "tags": ["letter", "wwii", "florence", "arthur", "correspondence"],
        "description": "Handwritten wartime letter sent from Florence to Arthur while he was stationed near Bristol.",
        "text": """March 14, 1944 — Dearest Arthur,
Spring has arrived timidly in Sussex. The daffodils near the garden stone wall opened their pale yellow petals yesterday. 
The postal carrier said trains from Bristol have been delayed by morning fog, but I watch the lane every afternoon for your post. 
Mother repaired your tweed overcoat, and we have tucked away two tins of peaches for your homecoming."""
    },
    {
        "id": "mem-sample-03",
        "title": "Grandmother Maya's Kitchen Memories (Oral History)",
        "source_type": "recording",
        "event_date": "1988-07-20",
        "date_precision": "month",
        "tags": ["oral-history", "cooking", "grandmother", "audio-transcript"],
        "description": "Audio cassette tape interview recorded by David during summer vacation in July 1988.",
        "text": """[Audio Transcript — Recorded July 20, 1988, in Millfield Kitchen]
Interviewer: 'Grandma, what was the first thing you ever learned to bake?'
Grandmother Maya: 'Oh heavens, it was cardamom bread with my mother when I was barely seven years old. 
We had no electric mixer back then, just a heavy glazed ceramic bowl and a carved birch spoon. 
You had to knead the dough until your palms were warm and the yeast smelled sweet like morning clover.'"""
    },
    {
        "id": "mem-sample-04",
        "title": "Black-and-White Portrait on St. Mark's Steps",
        "source_type": "photograph",
        "event_date": "1961-06-15",
        "date_precision": "approximate",
        "tags": ["photograph", "venice", "portrait", "travel"],
        "description": "Silver gelatin print showing great-aunt Eleanor and uncle Julian sitting on the stone steps of St. Mark's Basilica.",
        "text": """[Archival Photograph Annotation]
Original silver gelatin print found in brown leather album. 
Depicts great-aunt Eleanor wearing a pleated cream linen dress and uncle Julian holding a folding Kodak camera. 
Written in graphite pencil on the back: 'St. Mark's steps, Venice, early summer 1961. The pigeons were relentless, but Julian insisted on the light.'"""
    },
    {
        "id": "mem-sample-05",
        "title": "Handwritten Recipe for Elderberry Cordial",
        "source_type": "document",
        "event_date": "1939-00-00",
        "date_precision": "approximate",
        "tags": ["recipe", "apothecary", "elderberry", "herbal"],
        "description": "Stained handwritten parchment found slipped into the family Bible. Approximate date circa late 1930s.",
        "text": """To make Elderberry Cordial for Winter Chills:
Gather ripe berries after the first frost, strip cleanly from stems using a silver fork. 
Simmer gently with whole cloves, crushed cinnamon bark, and sliced Seville oranges. 
Add raw sugar and brandy when cool. Seal in stone jars. 
(Note in margins: 'Grandmother always prepared this before Martinmas, around 1938 or 1939.')"""
    },
    {
        "id": "mem-sample-06",
        "title": "Parish Ledger vs. Uncle Thomas's Diary: The Clocktower Bell",
        "source_type": "document",
        "event_date": "1923-09-01",
        "date_precision": "year",
        "tags": ["conflict", "clocktower", "ledger", "diary", "discrepancy"],
        "description": "Historical record with conflicting dates regarding when the village clocktower bell was re-cast and installed.",
        "text": """RECORD A (St. Jude's Parish Council Minutes):
'The grand church bell was cracked during the gale of 1922 and sent to the Whitechapel Foundry. 
It was returned, blessed by Father Martin, and installed in the belfry on September 1, 1923.'

RECORD B (Uncle Thomas's Daily Journal):
'October 18, 1925: We finally hauled the new clocktower bell up the ropes this morning. 
The council arguments had dragged on for two whole years before the foundry was paid. Father Martin was already bedridden, 
so curate Davis gave the blessing.'"""
    }
]

async def seed_sample_data():
    """Seed the database and vector store with verified synthetic sample data."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Seed collection
        col_id = "col-sample-heritage"
        cursor.execute("SELECT id FROM collections WHERE id = ?", (col_id,))
        if not cursor.fetchone():
            now = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO collections (id, title, description, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
            """, (
                col_id,
                "Family Heritage & Oral Histories",
                "Curated records spanning 1923 to 1988 preserving our ancestors' letters, recipes, and recollections.",
                now, now
            ))

        # Seed memories
        for mem in SAMPLE_MEMORIES:
            cursor.execute("SELECT id FROM memories WHERE id = ?", (mem["id"],))
            if cursor.fetchone():
                continue

            now = datetime.utcnow().isoformat()
            content_hash = hashlib.sha256(mem["text"].encode("utf-8")).hexdigest()

            cursor.execute("""
                INSERT INTO memories (
                    id, title, source_type, original_filename, file_path, content_hash,
                    extracted_text, description, event_date, date_precision,
                    extraction_method, processing_status, tags_json, collection_ids_json,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                mem["id"],
                mem["title"],
                mem["source_type"],
                f"{mem['id']}.txt",
                None,
                content_hash,
                mem["text"],
                mem["description"],
                mem["event_date"],
                mem["date_precision"],
                "sample_seeder",
                "indexed",
                json.dumps(mem["tags"]),
                json.dumps([col_id]),
                now, now
            ))

            # Link collection
            cursor.execute("""
                INSERT OR IGNORE INTO collection_memories (collection_id, memory_id)
                VALUES (?, ?)
            """, (col_id, mem["id"]))

            # Insert Passages & Vector Store
            passages = chunk_text_into_passages(mem["text"])
            for idx, (p_text, page_num) in enumerate(passages):
                passage_id = f"{mem['id']}-p{idx+1}"
                cursor.execute("""
                    INSERT OR REPLACE INTO source_passages (
                        id, memory_id, passage_text, page_number, embedding_id, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """, (passage_id, mem["id"], p_text, page_num, passage_id, now))

                await vector_store.add_passage(
                    passage_id=passage_id,
                    memory_id=mem["id"],
                    memory_title=mem["title"],
                    source_type=mem["source_type"],
                    passage_text=p_text,
                    event_date=mem["event_date"],
                    date_precision=mem["date_precision"],
                    tags=mem["tags"]
                )

            # Insert Timeline Event
            has_conflict = 1 if "conflict" in mem["tags"] else 0
            conflict_notes = "Parish ledger records installation in 1923, whereas Uncle Thomas's journal insists installation was delayed until October 1925." if has_conflict else None

            cursor.execute("""
                INSERT OR REPLACE INTO timeline_events (
                    id, memory_id, title, description, event_date, date_precision, source_type, has_conflict, conflict_notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                f"time-{mem['id']}",
                mem["id"],
                mem["title"],
                mem["description"],
                mem["event_date"],
                mem["date_precision"],
                mem["source_type"],
                has_conflict,
                conflict_notes
            ))

        # Seed Remembrance Room Item
        rem_id = "rem-sample-01"
        cursor.execute("SELECT id FROM remembrance_items WHERE id = ?", (rem_id,))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO remembrance_items (
                    id, name, relationship, birth_date, passing_date,
                    favorite_quote, favorite_food_or_music, reflection,
                    associated_memory_ids_json, photo_url, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                rem_id,
                "Maya Rosewood (née Linnea)",
                "Maternal Grandmother",
                "1912-04-18",
                "1997-11-03",
                "Patience in baking is patience with life.",
                "Warm cardamom bread and Vivaldi's Four Seasons",
                "A quiet, steadfast soul who held our family together through wartime and peace. Her kitchen was always warm, smelling of yeast, butter, and freshly brewed black tea.",
                json.dumps(["mem-sample-01", "mem-sample-03"]),
                None,
                datetime.utcnow().isoformat()
            ))

        conn.commit()
