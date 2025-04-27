-- CreateTable
CREATE TABLE "VehicleType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VehicleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "id" SERIAL NOT NULL,
    "vehicleTypeId" INTEGER NOT NULL,
    "vin" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleGpsLog" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "speed" DOUBLE PRECISION,
    "position" point NOT NULL,
    "battery" INTEGER,
    "direction" DOUBLE PRECISION,
    "acc" BOOLEAN,
    "charging" BOOLEAN,

    CONSTRAINT "VehicleGpsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationVehicles" (
    "id" SERIAL NOT NULL,
    "operationId" INTEGER NOT NULL,
    "vehicleTypeId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OperationVehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routes" (
    "id" SERIAL NOT NULL,
    "vehicleTypeId" INTEGER NOT NULL,
    "source" point NOT NULL,
    "destination" point NOT NULL,
    "durationInSec" INTEGER,
    "distance" DOUBLE PRECISION,

    CONSTRAINT "Routes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_vin_key" ON "Vehicles"("vin");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "VehicleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleGpsLog" ADD CONSTRAINT "VehicleGpsLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationVehicles" ADD CONSTRAINT "OperationVehicles_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationVehicles" ADD CONSTRAINT "OperationVehicles_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "VehicleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routes" ADD CONSTRAINT "Routes_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "VehicleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
