class dbUsers {
  constructor(dao) {
    this.dao = dao;
  }

  addUser(data) {
    const sql = `insert into users(username, datejoined, img, phoneno, email, fullname, password, org, role) values(
      $1,CURRENT_TIMESTAMP,$2,$3,$4,$5,$6,$7,$8
    )`;
    return this.dao.run(sql, [
      data.username,
      data.profilepic,
      data.phone,
      data.email,
      data.fullname,
      data.password,
      data.org,
      data.role,
    ]);
  }

  getUsers() {
    return this.dao.run(`select * from users`);
  }

  getUser(data) {
    return this.dao.run(`select * from users where username=$1`, [
      data.username,
    ]);
  }

  updateUser(userdata) {
    const data = userdata.data?.user || userdata;

    return this.dao.run(
      `update users set img=$1,phoneno=$2, fullname=$3, org=$4, role = $5 where username = $6 returning *`,
      [
        userdata?.filename || userdata.img,
        data.phoneno,
        data.fullname,
        data.org,
        data.role,
        data.username,
      ]
    );
  }
}

module.exports = dbUsers;
