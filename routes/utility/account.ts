// account.ts
import  query from './asyncDB';

// 查詢會員資料
async function account_query() {
    const rows = await query('SELECT * FROM account.member');
    console.log(rows);
    return rows;  
}

export { account_query };
