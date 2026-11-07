/**
 * MySQL: aircraft_id must be NULLable before FK can use ON DELETE SET NULL.
 * Sequelize sync({ alter: true }) often adds the FK before widening the column — this runs first.
 */
async function fixProformaInvoiceAircraftNullable(sequelize) {
  const table = "proforma_invoices";

  const tableExists = async () => {
    const [rows] = await sequelize.query(
      `SELECT 1 FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :t LIMIT 1`,
      { replacements: { t: table } }
    );
    return rows.length > 0;
  };

  if (!(await tableExists())) {
    return;
  }

  const [fks] = await sequelize.query(
    `SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = :t
       AND COLUMN_NAME = 'aircraft_id'
       AND REFERENCED_TABLE_NAME IS NOT NULL`,
    { replacements: { t: table } }
  );

  for (const row of fks) {
    const name = row.CONSTRAINT_NAME;
    if (name) {
      await sequelize.query(
        `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${name}\``
      );
    }
  }

  await sequelize.query(
    `ALTER TABLE \`${table}\` MODIFY COLUMN aircraft_id INT NULL`
  );

  const [regCol] = await sequelize.query(`SHOW COLUMNS FROM \`${table}\` LIKE 'aircraft_reg_no'`);
  if (!regCol.length) {
    await sequelize.query(
      `ALTER TABLE \`${table}\` ADD COLUMN aircraft_reg_no VARCHAR(45) NULL`
    );
  }

  const [modelCol] = await sequelize.query(
    `SHOW COLUMNS FROM \`${table}\` LIKE 'aircraft_model_name'`
  );
  if (!modelCol.length) {
    await sequelize.query(
      `ALTER TABLE \`${table}\` ADD COLUMN aircraft_model_name VARCHAR(255) NULL`
    );
  }
}

module.exports = { fixProformaInvoiceAircraftNullable };
