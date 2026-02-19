import csv
import io
import logging
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

logger = logging.getLogger(__name__)


class ExportService:
    """Service for exporting meeting analysis results to PDF and CSV formats"""
    
    @staticmethod
    def export_to_pdf(title: str, summary: str, key_points: List[str], action_items: List[Dict[str, Any]]) -> bytes:
        """Export analysis results to PDF format"""
        try:
            # Create a BytesIO object to hold the PDF
            pdf_buffer = io.BytesIO()
            
            # Create PDF document with smaller margins
            doc = SimpleDocTemplate(
                pdf_buffer,
                pagesize=letter,
                rightMargin=0.4*inch,
                leftMargin=0.4*inch,
                topMargin=0.5*inch,
                bottomMargin=0.4*inch
            )
            
            # Container for PDF elements
            elements = []
            
            # Define styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=14,
                textColor=colors.HexColor('#1e40af'),
                spaceAfter=8,
                fontName='Helvetica-Bold'
            )
            
            heading_style = ParagraphStyle(
                'CustomHeading',
                parent=styles['Heading2'],
                fontSize=11,
                textColor=colors.HexColor('#1e40af'),
                spaceAfter=6,
                spaceBefore=6,
                fontName='Helvetica-Bold'
            )
            
            normal_style = ParagraphStyle(
                'CustomNormal',
                parent=styles['Normal'],
                fontSize=9,
                spaceAfter=4
            )
            
            # Title
            elements.append(Paragraph(f"Meeting Analysis Report", title_style))
            elements.append(Spacer(1, 0.15*inch))
            
            # Timestamp
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            elements.append(Paragraph(f"<b>Generated:</b> {timestamp}", normal_style))
            elements.append(Spacer(1, 0.15*inch))
            
            # Summary
            elements.append(Paragraph("Summary", heading_style))
            elements.append(Paragraph(summary, normal_style))
            elements.append(Spacer(1, 0.1*inch))
            
            # Key Points
            if key_points:
                elements.append(Paragraph("Key Points", heading_style))
                for point in key_points:
                    point_text = f"<bullet>•</bullet> {point}"
                    elements.append(Paragraph(point_text, normal_style))
                elements.append(Spacer(1, 0.1*inch))
            
            # Action Items Table
            if action_items:
                elements.append(Paragraph("Action Items", heading_style))
                elements.append(Spacer(1, 0.05*inch))
                
                # Create table data with better formatting
                table_data = [["Task", "Owner", "Deadline", "Priority"]]
                
                for item in action_items:
                    owner = item.get("owner") or "—"
                    deadline = item.get("deadline") or "—"
                    priority = item.get("priority", "medium").upper()
                    description = item.get("description", "")
                    
                    # Truncate long descriptions to fit
                    if len(description) > 60:
                        description = description[:57] + "..."
                    
                    table_data.append([
                        description,
                        owner,
                        deadline,
                        priority
                    ])
                
                # Create table with better column widths
                table = Table(
                    table_data,
                    colWidths=[3.0*inch, 1.1*inch, 1.0*inch, 0.8*inch]
                )
                
                # Style the table
                table.setStyle(TableStyle([
                    # Header row
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                    ('TOPPADDING', (0, 0), (-1, 0), 8),
                    
                    # Body rows
                    ('ALIGN', (0, 1), (0, -1), 'LEFT'),
                    ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
                    ('FONTSIZE', (0, 1), (-1, -1), 8),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')]),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('TOPPADDING', (0, 1), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
                    ('LEFTPADDING', (0, 0), (-1, -1), 6),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                ]))
                
                elements.append(table)
            
            # Build PDF
            doc.build(elements)
            
            # Get PDF bytes
            pdf_buffer.seek(0)
            logger.info("Successfully generated PDF export")
            return pdf_buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Error generating PDF: {str(e)}")
            raise
    
    @staticmethod
    def export_to_csv(title: str, summary: str, key_points: List[str], action_items: List[Dict[str, Any]]) -> str:
        """Export analysis results to CSV format"""
        try:
            # Create CSV in memory
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            writer.writerow(["Meeting Analysis Export"])
            writer.writerow([f"Title: {title}"])
            writer.writerow([f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"])
            writer.writerow([])
            
            # Write summary
            writer.writerow(["SUMMARY"])
            writer.writerow([summary])
            writer.writerow([])
            
            # Write key points
            if key_points:
                writer.writerow(["KEY POINTS"])
                for point in key_points:
                    writer.writerow([point])
                writer.writerow([])
            
            # Write action items
            if action_items:
                writer.writerow(["ACTION ITEMS"])
                writer.writerow(["Task Description", "Owner", "Deadline", "Priority", "Status"])
                
                for item in action_items:
                    writer.writerow([
                        item.get("description", ""),
                        item.get("owner") or "Unassigned",
                        item.get("deadline") or "Not specified",
                        item.get("priority", "medium").upper(),
                        item.get("status", "pending").upper()
                    ])
            
            csv_content = output.getvalue()
            logger.info("Successfully generated CSV export")
            return csv_content
            
        except Exception as e:
            logger.error(f"Error generating CSV: {str(e)}")
            raise
