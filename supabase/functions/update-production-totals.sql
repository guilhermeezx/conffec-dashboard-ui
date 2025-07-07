
-- Function to update production totals
CREATE OR REPLACE FUNCTION update_production_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update totals for the affected ordem de produção
  UPDATE ordens_producao 
  SET 
    qtde_total_produzida = (
      SELECT COALESCE(SUM(qtde_produzida), 0) 
      FROM registros_producao 
      WHERE op_id = COALESCE(NEW.op_id, OLD.op_id)
        AND status_inspecao = 'aprovado'
    ),
    qtde_total_reprovada = (
      SELECT COALESCE(SUM(qtde_reprovada), 0) 
      FROM registros_producao 
      WHERE op_id = COALESCE(NEW.op_id, OLD.op_id)
        AND qtde_reprovada IS NOT NULL
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.op_id, OLD.op_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT
CREATE OR REPLACE TRIGGER trigger_update_production_totals_insert
  AFTER INSERT ON registros_producao
  FOR EACH ROW
  EXECUTE FUNCTION update_production_totals();

-- Create trigger for UPDATE  
CREATE OR REPLACE TRIGGER trigger_update_production_totals_update
  AFTER UPDATE ON registros_producao
  FOR EACH ROW
  EXECUTE FUNCTION update_production_totals();

-- Create trigger for DELETE
CREATE OR REPLACE TRIGGER trigger_update_production_totals_delete
  AFTER DELETE ON registros_producao
  FOR EACH ROW
  EXECUTE FUNCTION update_production_totals();
