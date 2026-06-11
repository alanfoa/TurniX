import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(range: "today" | "week" | "month") {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const rangeStart = range === "today" ? todayStart : range === "week" ? weekStart : monthStart;

    // --- Today's appointments ---
    const todayAppointments = await this.prisma.appointment.count({
      where: {
        date: { gte: todayStart, lt: todayEnd },
      },
    });

    // --- Today's revenue ---
    const todayRevenueResult = await this.prisma.appointment.aggregate({
      where: {
        date: { gte: todayStart, lt: todayEnd },
        status: "CONFIRMED",
      },
      _sum: { price: true },
    });
    const todayRevenue = todayRevenueResult._sum.price ?? 0;

    // --- New clients in range ---
    const newClients = await this.prisma.user.count({
      where: {
        role: "CLIENT",
        createdAt: { gte: rangeStart },
      },
    });

    // --- Confirmation rate (range) ---
    const totalInRange = await this.prisma.appointment.count({
      where: {
        createdAt: { gte: rangeStart },
      },
    });
    const confirmedInRange = await this.prisma.appointment.count({
      where: {
        createdAt: { gte: rangeStart },
        status: "CONFIRMED",
      },
    });
    const confirmationRate = totalInRange > 0 ? Math.round((confirmedInRange / totalInRange) * 100) : 0;

    // --- Weekly appointments (bar chart) ---
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekDays = await this.prisma.appointment.findMany({
      where: {
        date: { gte: weekStart, lt: weekEnd },
      },
      select: { date: true, status: true, startTime: true },
    });

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const weeklyAppointments = dayNames.map((day, i) => {
      const dayStart = new Date(weekStart);
      dayStart.setDate(dayStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const dayAppts = weekDays.filter(
        (a) => a.date >= dayStart && a.date < dayEnd,
      );
      return {
        day,
        confirmados: dayAppts.filter((a) => a.status === "CONFIRMED").length,
        pendientes: dayAppts.filter((a) => a.status === "PENDING").length,
        cancelados: dayAppts.filter((a) => a.status === "CANCELLED").length,
      };
    });

    // --- Monthly revenue (line chart) ---
    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyAppointments = await this.prisma.appointment.findMany({
      where: {
        date: { gte: thirtyDaysAgo, lt: todayEnd },
        status: "CONFIRMED",
      },
      select: { date: true, price: true },
    });

    const monthlyRevenue: { date: string; amount: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const dayStr = `${d.getDate()}`;
      const dayTotal = monthlyAppointments
        .filter((a) => {
          const ad = new Date(a.date);
          return (
            ad.getDate() === d.getDate() &&
            ad.getMonth() === d.getMonth() &&
            ad.getFullYear() === d.getFullYear()
          );
        })
        .reduce((sum, a) => sum + a.price, 0);
      monthlyRevenue.push({ date: dayStr, amount: dayTotal });
    }

    // --- Top services (range) ---
    const serviceCounts = await this.prisma.appointment.groupBy({
      by: ["serviceId"],
      where: { createdAt: { gte: rangeStart } },
      _count: { id: true },
      _sum: { price: true },
    });

    const allServices = await this.prisma.service.findMany({
      select: { id: true, name: true },
    });
    const serviceMap = new Map(allServices.map((s) => [s.id, s.name]));
    const totalAppts = serviceCounts.reduce((sum, s) => sum + s._count.id, 0);

    const topServices = serviceCounts
      .map((s) => ({
        name: serviceMap.get(s.serviceId) ?? "Unknown",
        count: s._count.id,
        percentage: totalAppts > 0 ? Math.round((s._count.id / totalAppts) * 100) : 0,
        revenue: s._sum.price ?? 0,
      }))
      .sort((a, b) => b.count - a.count);

    // --- Professional performance ---
    const profCounts = await this.prisma.appointment.groupBy({
      by: ["professionalId"],
      where: { createdAt: { gte: rangeStart } },
      _count: { id: true },
      _sum: { price: true },
    });

    const allProfessionals = await this.prisma.professional.findMany({
      select: { id: true, name: true },
    });
    const profMap = new Map(allProfessionals.map((p) => [p.id, p.name]));

    const professionalPerformance = profCounts
      .map((p) => ({
        name: profMap.get(p.professionalId) ?? "Unknown",
        appointments: p._count.id,
        revenue: p._sum.price ?? 0,
      }))
      .sort((a, b) => b.appointments - a.appointments);

    // --- Today's timeline ---
    const todayTimelineAppts = await this.prisma.appointment.findMany({
      where: {
        date: { gte: todayStart, lt: todayEnd },
      },
      include: {
        user: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { startTime: "asc" },
    });

    const todayTimeline = todayTimelineAppts.map((a) => ({
      time: a.startTime,
      client: a.user.name,
      service: a.service.name,
      status: a.status,
    }));

    // --- Upcoming appointments (next 10) ---
    const upcoming = await this.prisma.appointment.findMany({
      where: {
        date: { gte: todayStart },
        status: { not: "CANCELLED" },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        professional: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      take: 10,
    });

    return {
      todayAppointments,
      todayRevenue,
      newClientsThisWeek: newClients,
      confirmationRate,
      weeklyAppointments,
      monthlyRevenue,
      topServices,
      professionalPerformance,
      todayTimeline,
      upcomingAppointments: upcoming,
    };
  }
}
