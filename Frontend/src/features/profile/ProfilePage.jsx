import { useState } from 'react'
import {
  BookOpen,
  Camera,
  Code2,
  ExternalLink,
  GitBranch,
  Palette,
} from 'lucide-react'
import PageIntro from '../../components/common/PageIntro'
import profileImage from './profile.jpg'

const PROFILE_LINKS = [
  { label: 'GitHub', description: 'Source code dự án', href: 'https://github.com/Toanproptit/IOT_Light_Sensor.git', icon: GitBranch, className: 'github' },
  { label: 'Figma', description: 'UI/UX Design', href: 'https://www.figma.com/', icon: Palette, className: 'figma' },
  { label: 'Project Docs', description: 'Tài liệu dự án', href: '#project-docs', icon: BookOpen, className: 'docs' },
  { label: 'API Document', description: 'REST API Reference', href: '/docs/API_DOCUMENTATION.md', icon: Code2, className: 'api' },
]

function InfoField({ label, value }) {
  return (
    <div className="info-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ProjectLink({ link }) {
  const Icon = link.icon
  const opensInNewTab = link.href.startsWith('http') || link.href.endsWith('.md')

  return (
    <a
      className="project-link"
      href={link.href}
      target={opensInNewTab ? '_blank' : undefined}
      rel={opensInNewTab ? 'noreferrer' : undefined}
    >
      <span className={`link-icon ${link.className}`}><Icon size={20} /></span>
      <span><strong>{link.label}</strong><small>{link.description}</small></span>
      <ExternalLink size={16} />
    </a>
  )
}

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState(profileImage)

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(typeof reader.result === 'string' ? reader.result : '')
    reader.readAsDataURL(file)
  }

  return (
    <div className="page profile-page">
      <PageIntro
        eyebrow="Tài khoản"
        title="Thông tin cá nhân"
      />

      <div className='profile-stack'>
        <section className='card details-card'>
          <div className="section-head">
            <div><h2>Thông tin chi tiết</h2><p>Thông tin học tập và liên hệ</p></div>
          </div>
          <div className='profile-details-layout'>
            <div className='avatar-upload'>
              <label className='profile-avatar-picker'>
                <span className='profile-avatar-image'>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt='Ảnh đại diện đã chọn' />
                  ) : (
                    <span>TT</span>
                  )}
                </span>
                <i><Camera size={16} /></i>
                <input
                  type='file'
                  accept='image/png,image/jpeg,image/webp'
                  onChange={handleAvatarChange}
                />
              </label>
              <strong>Ảnh đại diện</strong>
            </div>

            <div className="detail-grid">
              <InfoField label="Họ và tên" value="Nguyễn Trọng Toàn" />
              <InfoField label="Mã sinh viên" value="B23DCCN833" />
              <InfoField label="Học viện" value="PTIT" />
              <InfoField label="Email" value="b23dccn833@stu.ptit.edu.vn" />
            </div>
          </div>
        </section>

        <section className="card project-links">
          <div className="section-head">
            <div><h2>Tài nguyên dự án</h2><p>Liên kết thiết kế, mã nguồn và tài liệu</p></div>
            <ExternalLink size={18} />
          </div>
          <div className="link-grid">
            {PROFILE_LINKS.map((link) => <ProjectLink link={link} key={link.label} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
