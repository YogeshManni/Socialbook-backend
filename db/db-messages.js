class dbMessage {
  constructor(dbo) {
    this.dbo = dbo;
  }

  async addMessage(data) {
    const query = `insert into messages(from_user,to_user, text) values(
            $1,$2,$3)`;
    return await this.dbo.run(query, [data.from_user, data.to_user, data.text]);
  }

  async getMessages(data) {
    const query = `select * from messages where (from_user = $1 and to_user = $2) or (from_user = $2 and to_user = $1) order by timestamp asc`;
    return await this.dbo.run(query, [data.from_user, data.to_user]);
  }
}

module.exports = dbMessage;
