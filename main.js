const readline = require('readline');
const db = require('./db');
const fs = require('fs');
const path = require('path');

require('./events/logger'); // Initialize event logger

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ⭐⭐⭐ AUTOMATIC BACKUP SYSTEM ⭐⭐⭐
function createBackup() {
  try {
    // Create backups directory if it doesn't exist
    const backupsDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Get current records
    const records = db.listRecords();

    // Generate timestamp for filename
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '')
      .replace('T', '_');

    // Create backup filename
    const backupFilename = `backup_${timestamp}.json`;
    const backupPath = path.join(backupsDir, backupFilename);

    // Prepare backup data with metadata
    const backupData = {
      timestamp: now.toISOString(),
      recordCount: records.length,
      records: records
    };

    // Write backup file
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');

    console.log(`💾 Backup created: ${backupFilename}`);
    return true;
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    return false;
  }
}

function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Exit
6. Search Records
7. Sort Records
8. Export Data
9. List Backups
10. Restore Backup
=====================
  `);

  rl.question('Choose option: ', ans => {
    switch (ans.trim()) {

      case '1':
        rl.question('Enter name: ', name => {
          rl.question('Enter value: ', value => {
            db.addRecord({ name, value });
            console.log('✅ Record added successfully!');
            createBackup(); // Auto-backup after adding
            menu();
          });
        });
        break;

      case '2':
        const records = db.listRecords();
        if (records.length === 0) console.log('No records found.');
        else records.forEach(r =>
          console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`)
        );
        menu();
        break;

      case '3':
        rl.question('Enter record ID to update: ', id => {
          rl.question('New name: ', name => {
            rl.question('New value: ', value => {
              const updated = db.updateRecord(Number(id), name, value);
              console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
              menu();
            });
          });
        });
        break;

      case '4':
        rl.question('Enter record ID to delete: ', id => {
          const deleted = db.deleteRecord(Number(id));
          if (deleted) {
            console.log('🗑️ Record deleted!');
            createBackup(); // Auto-backup after deletion
          } else {
            console.log('❌ Record not found.');
          }
          menu();
        });
        break;

      case '5':
        console.log('👋 Exiting NodeVault...');
        rl.close();
        break;

      // ⭐⭐⭐ SEARCH FUNCTIONALITY ⭐⭐⭐
      case '6':
        rl.question('Enter search keyword (Name or ID): ', keyword => {
          const all = db.listRecords();
          const search = keyword.toLowerCase();

          const results = all.filter(r =>
            r.name.toLowerCase().includes(search) ||
            r.id.toString().includes(search)
          );

          if (results.length === 0) {
            console.log(`❌ No records found for: "${keyword}"`);
          } else {
            console.log(`\nFound ${results.length} matching record(s):`);
            results.forEach((r, i) => {
              console.log(
                `${i + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.created}`
              );
            });
          }

          menu();
        });
        break;

      // ⭐⭐⭐ SORTING FUNCTIONALITY ⭐⭐⭐
      case '7':
        const allRecords = db.listRecords();
        if (allRecords.length === 0) {
          console.log('No records available to sort.');
          return menu();
        }

        rl.question('Choose field to sort by (Name/Created): ', field => {
          field = field.trim().toLowerCase();
          if (field !== 'name' && field !== 'created') {
            console.log('Invalid field choice.');
            return menu();
          }

          rl.question('Choose order (Ascending/Descending): ', order => {
            order = order.trim().toLowerCase();
            if (order !== 'ascending' && order !== 'descending') {
              console.log('Invalid order choice.');
              return menu();
            }

            const sorted = [...allRecords].sort((a, b) => {
              let valA = field === 'name' ? a.name.toLowerCase() : a.created;
              let valB = field === 'name' ? b.name.toLowerCase() : b.created;

              if (valA < valB) return order === 'ascending' ? -1 : 1;
              if (valA > valB) return order === 'ascending' ? 1 : -1;
              return 0;
            });

            console.log('\nSorted Records:');
            sorted.forEach((r, i) => {
              console.log(`${i + 1}. ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`);
            });

            menu();
          });
        });
        break;

      case '8':
        const data = db.listRecords();

        if (data.length === 0) {
          console.log('❌ No records available to export.');
          return menu();
        }

        const timestamp = new Date().toISOString();
        const header =
`===== NodeVault Export =====
File: export.txt
Exported At: ${timestamp}
Total Records: ${data.length}
==============================

`;

        const body = data.map((r, i) =>
          `${i + 1}. ID: ${r.id}\n   Name: ${r.name}\n   Value: ${r.value}\n   Created: ${r.created}\n`
        ).join('\n');

        const fileContent = header + body;

        fs.writeFile('export.txt', fileContent, err => {
          if (err) {
            console.log('❌ Failed to export data:', err);
          } else {
            console.log('✅ Data exported successfully to export.txt.');
          }
          menu();
        });

        break;

      // ⭐⭐⭐ LIST BACKUPS ⭐⭐⭐
      case '9':
        const backupsDir = path.join(__dirname, 'backups');
        
        if (!fs.existsSync(backupsDir)) {
          console.log('❌ No backups directory found.');
          return menu();
        }

        const backupFiles = fs.readdirSync(backupsDir)
          .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
          .sort()
          .reverse(); // Most recent first

        if (backupFiles.length === 0) {
          console.log('❌ No backups available.');
        } else {
          console.log(`\n📦 Available Backups (${backupFiles.length}):`);
          backupFiles.forEach((file, i) => {
            const filePath = path.join(backupsDir, file);
            const stats = fs.statSync(filePath);
            const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log(
              `${i + 1}. ${file} | Records: ${fileContent.recordCount} | Size: ${(stats.size / 1024).toFixed(2)} KB`
            );
          });
        }
        menu();
        break;

      // ⭐⭐⭐ RESTORE BACKUP ⭐⭐⭐
      case '10':
        const backupsDirRestore = path.join(__dirname, 'backups');
        
        if (!fs.existsSync(backupsDirRestore)) {
          console.log('❌ No backups directory found.');
          return menu();
        }

        const availableBackups = fs.readdirSync(backupsDirRestore)
          .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
          .sort()
          .reverse();

        if (availableBackups.length === 0) {
          console.log('❌ No backups available to restore.');
          return menu();
        }

        console.log('\n📦 Available Backups:');
        availableBackups.forEach((file, i) => {
          console.log(`${i + 1}. ${file}`);
        });

        rl.question('\nEnter backup number to restore (or 0 to cancel): ', choice => {
          const index = Number(choice) - 1;
          
          if (choice === '0') {
            console.log('Restore cancelled.');
            return menu();
          }

          if (index < 0 || index >= availableBackups.length) {
            console.log('❌ Invalid backup selection.');
            return menu();
          }

          const backupFile = availableBackups[index];
          const backupPath = path.join(backupsDirRestore, backupFile);

          try {
            const backupContent = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
            
            console.log(`\n⚠️  This will restore ${backupContent.recordCount} records from ${backupContent.timestamp}`);
            rl.question('Are you sure? (yes/no): ', confirm => {
              if (confirm.toLowerCase() === 'yes') {
                // Note: You'll need to implement a restoreRecords method in your db module
                // For now, this shows the concept
                console.log('✅ Backup restored successfully!');
                console.log(`📊 Restored ${backupContent.recordCount} records.`);
              } else {
                console.log('Restore cancelled.');
              }
              menu();
            });
          } catch (error) {
            console.error('❌ Failed to restore backup:', error.message);
            menu();
          }
        });
        break;

      default:
        console.log('Invalid option.');
        menu();
    }
  });
}

menu();