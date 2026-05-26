import PublicationTrend from "../models/PublicationTrend";
import { calculateGrowthRate } from "../utils/analytics";

export class PublicationTrendService {
  static async getAllTrends(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const trends = await PublicationTrend.find()
      .populate("keywordId")
      .populate("journalId")
      .populate("analysisRunId")
      .skip(skip)
      .limit(limit)
      .sort({ calculatedAt: -1 });

    const total = await PublicationTrend.countDocuments();

    return {
      trends,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  static async getTrendingPublications(limit: number = 50) {
    const trends = await PublicationTrend.find({ isTrending: true })
      .populate("keywordId")
      .populate("journalId")
      .populate("analysisRunId")
      .sort({ growthRate: -1 })
      .limit(limit);

    return trends;
  }

  static async getTrendById(id: string) {
    const trend = await PublicationTrend.findById(id)
      .populate("keywordId")
      .populate("journalId")
      .populate("analysisRunId");

    if (!trend) {
      throw { status: 404, message: "Publication trend not found" };
    }

    return trend;
  }

  static async createTrend(trendData: any) {
    // Calculate growth rate if needed
    if (trendData.previousCount) {
      trendData.growthRate = calculateGrowthRate(
        trendData.paperCount,
        trendData.previousCount,
      );
    }

    // Determine if trending based on growth rate
    if (trendData.growthRate && trendData.growthRate > 0.2) {
      trendData.isTrending = true;
    }

    const trend = new PublicationTrend(trendData);
    await trend.save();
    await trend.populate(["keywordId", "journalId", "analysisRunId"]);

    return trend;
  }

  static async updateTrend(id: string, trendData: any) {
    const trend = await PublicationTrend.findByIdAndUpdate(id, trendData, {
      new: true,
    }).populate(["keywordId", "journalId", "analysisRunId"]);

    if (!trend) {
      throw { status: 404, message: "Publication trend not found" };
    }

    return trend;
  }

  static async deleteTrend(id: string) {
    const trend = await PublicationTrend.findByIdAndDelete(id);

    if (!trend) {
      throw { status: 404, message: "Publication trend not found" };
    }

    return trend;
  }

  static async getTrendsByKeyword(keywordId: string) {
    const trends = await PublicationTrend.find({ keywordId })
      .populate("keywordId")
      .populate("journalId")
      .populate("analysisRunId")
      .sort({ year: -1 });

    return trends;
  }

  static async getTrendsByJournal(journalId: string) {
    const trends = await PublicationTrend.find({ journalId })
      .populate("keywordId")
      .populate("journalId")
      .populate("analysisRunId")
      .sort({ year: -1 });

    return trends;
  }

  static async getTrendsByYear(year: number) {
    const trends = await PublicationTrend.find({ year })
      .populate("keywordId")
      .populate("journalId")
      .populate("analysisRunId")
      .sort({ growthRate: -1 });

    return trends;
  }

  static async getTrendsByYearRange(startYear: number, endYear: number) {
    const trends = await PublicationTrend.find({
      year: { $gte: startYear, $lte: endYear },
    })
      .populate("keywordId")
      .populate("journalId")
      .populate("analysisRunId")
      .sort({ year: 1, growthRate: -1 });

    return trends;
  }

  static async getMonthlyTrends(keywordId: string, year: number) {
    const trends = await PublicationTrend.find({
      keywordId,
      year,
      month: { $exists: true },
    })
      .populate("keywordId")
      .populate("journalId")
      .populate("analysisRunId")
      .sort({ month: 1 });

    return trends;
  }

  static async analyzeTrendGrowth(
    keywordId: string,
    startYear: number,
    endYear: number,
  ) {
    const trends = await PublicationTrend.find({
      keywordId,
      year: { $gte: startYear, $lte: endYear },
    }).sort({ year: 1 });

    const analysis = {
      keywordId,
      startYear,
      endYear,
      trends: trends.map((t) => ({
        year: t.year,
        paperCount: t.paperCount,
        growthRate: t.growthRate,
      })),
      overallGrowthRate:
        trends.length > 1
          ? calculateGrowthRate(
              trends[trends.length - 1].paperCount,
              trends[0].paperCount,
            )
          : 0,
    };

    return analysis;
  }
  // Aliases used by routes
  static getAllPublicationTrends = PublicationTrendService.getAllTrends;
  static getPublicationTrendById = PublicationTrendService.getTrendById;
  static createPublicationTrend = PublicationTrendService.createTrend;
  static updatePublicationTrend = PublicationTrendService.updateTrend;
  static deletePublicationTrend = PublicationTrendService.deleteTrend;
}
