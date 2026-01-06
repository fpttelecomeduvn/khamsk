/**
 * RULE ENGINE - Xếp loại sức khỏe theo Thông tư 14 & 62
 * Cấu trúc Module hóa cho dễ mở rộng
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  ExaminationType,
  HealthRank,
  ClinicalDataJson,
  Specialty,
  CalculateHealthRankDto,
} from '../../../shared/types';

@Injectable()
export class HealthRankEngine {
  private readonly logger = new Logger(HealthRankEngine.name);

  /**
   * Tính toán xếp loại sức khỏe cuối cùng
   * Đầu vào: dữ liệu lâm sàng từ tất cả chuyên khoa
   * Đầu ra: xếp loại cuối cùng + chi tiết từng chuyên khoa
   */
  async calculateFinalRank(
    dto: CalculateHealthRankDto,
  ): Promise<{
    specialtyRanks: Record<Specialty, number>;
    finalRank: HealthRank | number;
    reasons: string[];
  }> {
    const { examinationType, clinicalData } = dto;

    const specialtyRanks: Record<Specialty, number> = {};
    const reasons: string[] = [];

    // Tính xếp loại cho từng chuyên khoa
    for (const [specialty, data] of Object.entries(clinicalData)) {
      const rank = await this.calculateSpecialtyRank(
        specialty as Specialty,
        data,
        examinationType,
      );
      specialtyRanks[specialty as Specialty] = rank;
      this.logger.debug(
        `[${specialty}] Rank: ${rank}, Data:`,
        JSON.stringify(data),
      );
    }

    // Xác định xếp loại cuối cùng dựa trên loại khám
    let finalRank: HealthRank | number;

    if (examinationType === ExaminationType.CIVIL) {
      // Thông tư 14: Lấy xếp loại THẤP NHẤT (tức là SỐ CAO NHẤT)
      finalRank = await this.calculateCivilRank(specialtyRanks, reasons);
    } else if (examinationType === ExaminationType.POLICE) {
      // Thông tư 62: Kiểm tra knockout criteria
      finalRank = await this.calculatePoliceRank(
        specialtyRanks,
        clinicalData,
        reasons,
      );
    } else if (examinationType === ExaminationType.DRUG_REHAB) {
      // Cai nghiện: Tập trung vào ma túy
      finalRank = await this.calculateDrugRehabRank(
        specialtyRanks,
        clinicalData,
        reasons,
      );
    }

    return {
      specialtyRanks,
      finalRank,
      reasons,
    };
  }

  /**
   * Tính xếp loại từng chuyên khoa
   */
  private async calculateSpecialtyRank(
    specialty: Specialty,
    data: Record<string, any>,
    examinationType: ExaminationType,
  ): Promise<number> {
    switch (specialty) {
      case Specialty.INTERNAL:
        return this.calculateInternalMedicineRank(data, examinationType);

      case Specialty.OPHTHALMOLOGY:
        return this.calculateOphthalmologyRank(data, examinationType);

      case Specialty.LABORATORY:
        return this.calculateLaboratoryRank(data, examinationType);

      case Specialty.IMAGING:
        return this.calculateImagingRank(data);

      case Specialty.ECG:
        return this.calculateECGRank(data);

      case Specialty.SURGERY:
        return this.calculateSurgeryRank(data);

      case Specialty.ENT:
        return this.calculateENTRank(data);

      case Specialty.DENTISTRY:
        return this.calculateDentistryRank(data);

      case Specialty.DERMATOLOGY:
        return this.calculateDermatologyRank(data);

      case Specialty.GYNECOLOGY:
        return this.calculateGynecologyRank(data);

      case Specialty.ULTRASOUND:
        return this.calculateUltrasoundRank(data);

      default:
        // Specialty mới chưa cấu hình => return mặc định RANK_III (3)
        this.logger.warn(`[${specialty}] No rank config found, default to RANK_III`);
        return HealthRank.RANK_III;
    }
  }

  /**
   * ============ CHUYÊN KHOA: NỘI KHOA ============
   */
  private calculateInternalMedicineRank(
    data: Record<string, any>,
    examinationType: ExaminationType,
  ): number {
    const { heartRate, bpSystolic, bpDiastolic, temperature } = data;

    // Điểm cơ bản: kiểm tra các chỉ số
    let rank = HealthRank.RANK_I;

    // Huyết áp cao
    if (bpSystolic >= 160 || bpDiastolic >= 100) {
      rank = Math.max(rank, HealthRank.RANK_V);
    } else if (bpSystolic >= 140 || bpDiastolic >= 90) {
      rank = Math.max(rank, HealthRank.RANK_IV);
    } else if (bpSystolic >= 130 || bpDiastolic >= 85) {
      rank = Math.max(rank, HealthRank.RANK_III);
    }

    // Nhịp tim bất thường
    if (heartRate > 100 || heartRate < 60) {
      rank = Math.max(rank, HealthRank.RANK_III);
    }

    // Sốt
    if (temperature > 37.5) {
      rank = Math.max(rank, HealthRank.RANK_III);
    }

    return rank;
  }

  /**
   * ============ CHUYÊN KHOA: MẮT ============
   */
  private calculateOphthalmologyRank(
    data: Record<string, any>,
    examinationType: ExaminationType,
  ): number {
    const { visLeftUncorrected, visRightUncorrected, colorBlindness } = data;

    let rank = HealthRank.RANK_I;

    // Công an: tiêu chuẩn khắt khe hơn
    if (examinationType === ExaminationType.POLICE) {
      // Tổng thị lực phải >= 18/10, mỗi mắt >= 9/10
      const totalVis = (visLeftUncorrected || 0) + (visRightUncorrected || 0);
      if (totalVis < 18 || visLeftUncorrected < 9 || visRightUncorrected < 9) {
        return HealthRank.FAILED; // Không đạt
      }

      if (colorBlindness) {
        return HealthRank.FAILED;
      }
    }

    // Dân sự: tiêu chuẩn thông thường
    if (visLeftUncorrected < 2 || visRightUncorrected < 2) {
      rank = HealthRank.RANK_V;
    } else if (visLeftUncorrected < 5 || visRightUncorrected < 5) {
      rank = HealthRank.RANK_IV;
    } else if (visLeftUncorrected < 8 || visRightUncorrected < 8) {
      rank = HealthRank.RANK_III;
    }

    if (colorBlindness) {
      rank = Math.max(rank, HealthRank.RANK_IV);
    }

    return rank;
  }

  /**
   * ============ CHUYÊN KHOA: XÉT NGHIỆM ============
   */
  private calculateLaboratoryRank(
    data: Record<string, any>,
    examinationType: ExaminationType,
  ): number {
    const {
      wbc,
      hemoglobin,
      glucose,
      ast,
      alt,
      hiv,
      hbsAg,
      syphilis,
      drugTest,
    } = data;

    let rank = HealthRank.RANK_I;

    // HIV dương tính => Loại trừ công an, RANK_V dân sự
    if (hiv) {
      if (examinationType === ExaminationType.POLICE) {
        return HealthRank.FAILED;
      }
      rank = HealthRank.RANK_V;
    }

    // HBsAg dương tính => RANK_IV
    if (hbsAg) {
      rank = Math.max(rank, HealthRank.RANK_IV);
    }

    // Syphilis dương tính => RANK_V
    if (syphilis) {
      rank = Math.max(rank, HealthRank.RANK_V);
    }

    // Ma túy dương tính
    if (drugTest) {
      if (examinationType === ExaminationType.POLICE) {
        return HealthRank.FAILED;
      }
      rank = HealthRank.RANK_V;
    }

    // Glucose
    if (glucose > 250 || glucose < 70) {
      rank = Math.max(rank, HealthRank.RANK_IV);
    } else if (glucose > 200 || glucose < 80) {
      rank = Math.max(rank, HealthRank.RANK_III);
    }

    // Men gan
    if ((ast || 0) > 100 || (alt || 0) > 100) {
      rank = Math.max(rank, HealthRank.RANK_IV);
    } else if ((ast || 0) > 40 || (alt || 0) > 40) {
      rank = Math.max(rank, HealthRank.RANK_III);
    }

    return rank;
  }

  /**
   * ============ CHUYÊN KHOA: HÌNH ẢNH & ECG ============
   */
  private calculateImagingRank(data: Record<string, any>): number {
    const { xrayChestNormal } = data;
    if (!xrayChestNormal) {
      return HealthRank.RANK_IV; // Phổi bất thường => RANK_IV hoặc V
    }
    return HealthRank.RANK_I;
  }

  private calculateECGRank(data: Record<string, any>): number {
    const { ecgNormal } = data;
    if (!ecgNormal) {
      return HealthRank.RANK_IV;
    }
    return HealthRank.RANK_I;
  }

  /**
   * ============ CHUYÊN KHOA: KHÁC ============
   */
  private calculateSurgeryRank(data: Record<string, any>): number {
    // TODO: Implement surgery-specific logic
    return HealthRank.RANK_I;
  }

  private calculateENTRank(data: Record<string, any>): number {
    return HealthRank.RANK_I;
  }

  private calculateDentistryRank(data: Record<string, any>): number {
    return HealthRank.RANK_I;
  }

  private calculateDermatologyRank(data: Record<string, any>): number {
    return HealthRank.RANK_I;
  }

  private calculateGynecologyRank(data: Record<string, any>): number {
    return HealthRank.RANK_I;
  }

  private calculateUltrasoundRank(data: Record<string, any>): number {
    return HealthRank.RANK_I;
  }

  /**
   * ============ XẾP LOẠI CUỐI CÙNG ============
   */

  /**
   * Thông tư 14/2013/TT-BYT: LOẠI = CÁI THẤP NHẤT
   * (Mắt xích yếu nhất quyết định)
   */
  private async calculateCivilRank(
    specialtyRanks: Record<Specialty, number>,
    reasons: string[],
  ): Promise<number> {
    let finalRank = HealthRank.RANK_I;

    for (const [specialty, rank] of Object.entries(specialtyRanks)) {
      if (rank > finalRank) {
        finalRank = rank;
        reasons.push(`${specialty}: Rank ${rank}`);
      }
    }

    this.logger.debug(`[CIVIL] Final Rank: ${finalRank}, Reasons:`, reasons);
    return finalRank;
  }

  /**
   * Thông tư 62/2023/TT-BCA: ĐẠT / KHÔNG ĐẠT
   * Kiểm tra knockout criteria trước
   */
  private async calculatePoliceRank(
    specialtyRanks: Record<Specialty, number>,
    clinicalData: ClinicalDataJson,
    reasons: string[],
  ): Promise<number> {
    // Nếu bất kỳ chuyên khoa nào return FAILED (99) => tổng là FAILED
    for (const [specialty, rank] of Object.entries(specialtyRanks)) {
      if (rank === HealthRank.FAILED) {
        reasons.push(`${specialty}: FAILED (Knockout)`);
        return HealthRank.FAILED;
      }
    }

    // Nếu tất cả đạt => RANK_I
    this.logger.debug(`[POLICE] Final Rank: FAILED or PASSED`);
    return HealthRank.RANK_I;
  }

  /**
   * Cai nghiện: Tập trung vào xét nghiệm ma túy
   */
  private async calculateDrugRehabRank(
    specialtyRanks: Record<Specialty, number>,
    clinicalData: ClinicalDataJson,
    reasons: string[],
  ): Promise<number> {
    const { drugTest } = clinicalData.laboratory || {};

    if (drugTest) {
      reasons.push('Drug test positive: RANK_V');
      return HealthRank.RANK_V;
    }

    // Nếu âm tính nhưng có dấu hiệu khác => từng trường hợp cụ thể
    return Math.max(...Object.values(specialtyRanks));
  }
}
