FROM postgres:17

RUN apt-get update && \
    apt-get install -y postgresql-server-dev-17 git make gcc && \
    git clone --branch v0.5.0 https://github.com/pgvector/pgvector.git && \
    cd pgvector && make && make install && \
    cd .. && rm -rf pgvector && \
    apt-get remove -y git make gcc && \
    apt-get autoremove -y && apt-get clean