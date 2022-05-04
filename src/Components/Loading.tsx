import Button from '@mui/material/Button'

export const Loading = () => <div>Loading...</div>

export const RetryButton = ({ onClick }: { onClick: () => void }) => <Button onClick={onClick} size='small' variant='outlined'>Täzeden synanyş</Button>