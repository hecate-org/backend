-- CreateTable
CREATE TABLE "SocketConnection" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SocketConnection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocketConnection" ADD CONSTRAINT "SocketConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
