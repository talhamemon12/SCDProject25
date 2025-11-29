const readline = require('readline');
const db = require('./db');
require('./events/logger'); // Initialize event logger

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
=====================
  `);

  rl.question('Choose option: ', ans => {
    switch (ans.trim()) {

      case '1':
        rl.question('Enter name: ', name => {
          rl.question('Enter value: ', value => {
            db.addRecord({ name, value });
            console.log('✅ Record added successfully!');
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
          console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
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

      default:
        console.log('Invalid option.');
        menu();
    }
  });
}

menu();
