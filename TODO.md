# TODO - Fix Equipment and TP Data Retrieval

## Plan d'implémentation

### 1. Register Equipments Router in main.py
- [ ] Add import for equipments router in main.py
- [ ] Register the router with prefix `/api/v1/equipments`

### 2. Create TP (Travaux Pratiques) Model
- [ ] Create model file for TP
- [ ] Define TP model with fields: id, title, description, video_url, duration, date, laboratory_id

### 3. Create TP Schema (Pydantic)
- [ ] Create schema file for TP
- [ ] Define TPBase, TPCreate, TPUpdate, TPResponse schemas

### 4. Create TP API Endpoint
- [ ] Create router for TPs
- [ ] Implement CRUD endpoints: GET all, GET by id, POST, PUT, DELETE
- [ ] Add endpoint to get TPs by laboratory

### 5. Update Laboratory API to Include Equipment Data
- [ ] Modify LaboratoryDetailed schema to include actual equipment list
- [ ] Update get_laboratory endpoint to return equipments

### 6. Register TP Router in main.py
- [ ] Add import for TPs router
- [ ] Register the router with prefix `/api/v1/tps`

### 7. Update Database
- [ ] Create migration script or update init_db.py
- [ ] Create tables for equipments and tps

